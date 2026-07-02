import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import { itemsService }        from '../services/items.service'
import { categoriesService }   from '../services/categories.service'
import { tablesService }       from '../services/tables.service'
import { usersService }        from '../services/users.service'
import { commandsService }     from '../services/commands.service'
import { commandItemsService } from '../services/commandItems.service'
import { commandTypesService } from '../services/commandTypes.service'
import { stateCommandsService } from '../services/stateCommands.service'
import type { Item, Category, Table, User, CommandType, CommandSize, StateCommand } from '@elegante-amaro-app/shared/types'

// Drinks can be ordered in three sizes; the size scales the unit price.
const SIZES: CommandSize[] = ['petit', 'moyen', 'grand']
const SIZE_LABEL: Record<CommandSize, string> = { petit: 'Petit', moyen: 'Moyen', grand: 'Grand' }
const SIZE_MULT:  Record<CommandSize, number> = { petit: 0.85, moyen: 1, grand: 1.2 }

type Mode = 'sur place' | 'à emporter'

interface OrderLine { item: Item; qty: number; size: CommandSize; unitPrice: number; drink: boolean }

export default function NewCommand() {
  const navigate = useNavigate()

  const [items,        setItems]        = useState<Item[]>([])
  const [categories,   setCategories]   = useState<Category[]>([])
  const [tables,       setTables]       = useState<Table[]>([])
  const [users,        setUsers]        = useState<User[]>([])
  const [commandTypes, setCommandTypes] = useState<CommandType[]>([])
  const [states,       setStates]       = useState<StateCommand[]>([])
  const [quantities,   setQuantities]   = useState<Record<number, number>>({})      // item_id → qty
  const [sizes,        setSizes]        = useState<Record<number, CommandSize>>({})  // item_id → size (drinks only)
  const [mode,         setMode]         = useState<Mode>('sur place')
  const [form,         setForm]         = useState({ prenom: '', nom: '', email: '', tableId: 0 })
  const [saving,       setSaving]       = useState(false)
  const [loadError,    setLoadError]    = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      itemsService.getAll(),
      categoriesService.getAll(),
      tablesService.getAll(),
      usersService.getAll(),
      commandTypesService.getAll(),
      stateCommandsService.getAll(),
    ])
      .then(([i, c, t, u, ct, sc]) => { setItems(i); setCategories(c); setTables(t); setUsers(u); setCommandTypes(ct); setStates(sc) })
      .catch(() => setLoadError('Impossible de charger les données'))
  }, [])

  const isDrink = (item: Item) => {
    const cat = categories.find(c => c.id === item.category_id)
    return !!cat && /boisson/i.test(cat.name)
  }

  const unitPriceFor = (item: Item) => {
    if (!isDrink(item)) return item.price
    const size = sizes[item.id] ?? 'moyen'
    return item.price * SIZE_MULT[size]
  }

  const setQty = (itemId: number, delta: number) =>
    setQuantities(prev => {
      const next = Math.max(0, (prev[itemId] ?? 0) + delta)
      if (next === 0) { const nextQty = { ...prev }; delete nextQty[itemId]; return nextQty }
      return { ...prev, [itemId]: next }
    })

  const setSize = (itemId: number, size: CommandSize) =>
    setSizes(prev => ({ ...prev, [itemId]: size }))

  const lines: OrderLine[] = items
    .filter(i => (quantities[i.id] ?? 0) > 0)
    .map(i => {
      const drink = isDrink(i)
      const size: CommandSize = drink ? (sizes[i.id] ?? 'moyen') : 'moyen'
      return { item: i, qty: quantities[i.id], size, unitPrice: unitPriceFor(i), drink }
    })

  const total = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)
  const fmt   = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'

  const surPlace = mode === 'sur place'

  const handleValidate = async () => {
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim()) {
      alert('Veuillez renseigner le prénom, le nom et l\'email du client.')
      return
    }
    if (surPlace && !form.tableId) {
      alert('Veuillez sélectionner une table.')
      return
    }
    if (lines.length === 0) {
      alert('Veuillez sélectionner au moins un article.')
      return
    }
    setSaving(true)
    try {
      let user = users.find(u => u.email === form.email.trim())
      if (!user) {
        user = await usersService.create({
          name: `${form.prenom.trim()} ${form.nom.trim()}`,
          email: form.email.trim(),
          password_hash: '',
          fidelity_points: 0,
          roles: [],
        })
      }
      const typeId = commandTypes.find(t => t.name === mode)?.id ?? (surPlace ? 1 : 2)
      // Statut initial : premier statut non-final dans l'ordre configuré au
      // backoffice (l'id 1 peut avoir été supprimé/réordonné).
      const orderedStates = [...states].sort((a, b) => (a.position ?? a.id) - (b.position ?? b.id))
      const initialStateId = orderedStates.find(s => !s.is_final)?.id ?? orderedStates[0]?.id ?? 1
      const cmd = await commandsService.create({
        user_id: user.id,
        table_id: surPlace ? form.tableId : null,
        type_id: typeId,
        state_command_id: initialStateId,
        tva_rate: 10,
        total_price: total,
      })
      await Promise.all(lines.map(l =>
        commandItemsService.create({
          command_id: cmd.id,
          item_id: l.item.id,
          quantity: l.qty,
          unit_price: l.unitPrice,
          line_total: l.unitPrice * l.qty,
          size: l.size,
        })
      ))
      navigate('/dashboard')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la création de la commande')
    } finally {
      setSaving(false)
    }
  }

  if (loadError) return <div style={styles.center}><span style={styles.errorText}>{loadError}</span></div>

  return (
    <div style={styles.root}>

      {/* ── Left: catalog ───────────────────────────────── */}
      <div style={styles.catalog}>
        <h1 style={styles.catalogTitle}>Nouvelle commande</h1>

        {categories.map(cat => {
          const catItems = items.filter(i => i.category_id === cat.id)
          if (catItems.length === 0) return null
          return (
            <div key={cat.id} style={styles.catSection}>
              <div style={styles.catHeader}>
                <span style={styles.catLabel}>{cat.name}</span>
                <div style={styles.catRule} />
              </div>
              {catItems.map(item => {
                const qty   = quantities[item.id] ?? 0
                const drink = isDrink(item)
                const size  = sizes[item.id] ?? 'moyen'
                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.itemRow,
                      borderLeft: qty > 0
                        ? `3px solid ${theme.colors.accent}`
                        : '3px solid transparent',
                      backgroundColor: qty > 0 ? 'rgba(191,157,123,0.06)' : 'transparent',
                    }}
                  >
                    <div style={styles.itemMain}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.itemPrice}>{fmt(unitPriceFor(item))}</span>
                      <div style={styles.stepper}>
                        <button style={styles.stepBtn} onClick={() => setQty(item.id, -1)}>−</button>
                        <span style={styles.stepQty}>{qty}</span>
                        <button style={styles.stepBtn} onClick={() => setQty(item.id, +1)}>+</button>
                      </div>
                    </div>

                    {drink && qty > 0 && (
                      <div style={styles.sizeRow}>
                        {SIZES.map(s => {
                          const active = size === s
                          return (
                            <button
                              key={s}
                              onClick={() => setSize(item.id, s)}
                              style={{
                                ...styles.sizeBtn,
                                backgroundColor: active ? theme.colors.accent : 'transparent',
                                color: active ? theme.colors.onSecondary : theme.colors.accent,
                              }}
                            >
                              {SIZE_LABEL[s]}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Right: recap ────────────────────────────────── */}
      <div style={styles.recap}>
        <span style={styles.recapTitle}>Récapitulatif</span>

        <div style={styles.lineList}>
          {lines.length === 0
            ? <span style={styles.emptyLines}>Aucun article sélectionné</span>
            : lines.map(l => (
                <div key={l.item.id} style={styles.lineRow}>
                  <span style={styles.lineName}>
                    {l.item.name}{l.drink ? ` (${SIZE_LABEL[l.size]})` : ''} × {l.qty}
                  </span>
                  <span style={styles.lineTotal}>{fmt(l.unitPrice * l.qty)}</span>
                </div>
              ))
          }
        </div>

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total TTC</span>
          <span style={styles.totalValue}>{fmt(total)}</span>
        </div>

        <div style={styles.divider} />

        {/* Order type: sur place / à emporter */}
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Type de commande</label>
          <div style={styles.toggleRow}>
            {(['sur place', 'à emporter'] as Mode[]).map(m => {
              const active = mode === m
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    ...styles.toggleBtn,
                    backgroundColor: active ? theme.colors.accent : 'transparent',
                    color: active ? theme.colors.onSecondary : theme.colors.accent,
                  }}
                >
                  {m === 'sur place' ? 'Sur place' : 'À emporter'}
                </button>
              )
            })}
          </div>
        </div>

        {surPlace && (
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Table</label>
            <select
              style={styles.input}
              value={form.tableId}
              onChange={e => setForm(f => ({ ...f, tableId: Number(e.target.value) }))}
            >
              <option value={0}>— Choisir une table —</option>
              {tables.map(t => <option key={t.id} value={t.id}>Table {t.numero}</option>)}
            </select>
          </div>
        )}

        <div style={styles.field}>
          <label style={styles.fieldLabel}>Prénom</label>
          <input style={styles.input} value={form.prenom}  onChange={e => setForm(f => ({ ...f, prenom:  e.target.value }))} />
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Nom</label>
          <input style={styles.input} value={form.nom}     onChange={e => setForm(f => ({ ...f, nom:     e.target.value }))} />
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Email</label>
          <input style={styles.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email:   e.target.value }))} />
        </div>

        <button
          style={{
            ...styles.validateBtn,
            opacity: saving ? 0.6 : 1,
            cursor: saving ? 'wait' : 'pointer',
          }}
          onClick={handleValidate}
          disabled={saving}
        >
          {saving ? 'Création…' : 'Valider la commande'}
        </button>
      </div>

    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  center:       { display: 'flex', justifyContent: 'center', paddingTop: 80 },
  errorText:    { fontFamily: theme.fonts.ui, fontSize: 13, color: theme.colors.danger },

  root:         { display: 'flex', gap: 32, alignItems: 'flex-start', minHeight: 'calc(100vh - 48px)' },

  // Left catalog
  catalog:      { flex: '0 0 70%', paddingRight: 24 },
  catalogTitle: { fontFamily: theme.fonts.title, fontSize: 40, color: theme.colors.onPrimary, letterSpacing: '0.04em', marginBottom: 40 },
  catSection:   { marginBottom: 36 },
  catHeader:    { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 },
  catLabel:     { fontFamily: theme.fonts.ui, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: theme.colors.muted, whiteSpace: 'nowrap' },
  catRule:      { flex: 1, height: 1, backgroundColor: 'rgba(42,31,21,0.08)' },
  itemRow:      { display: 'flex', flexDirection: 'column', padding: '14px 12px', transition: 'background 0.15s, border-color 0.15s' },
  itemMain:     { display: 'flex', alignItems: 'center', gap: 16 },
  itemName:     { flex: 1, fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.onPrimary },
  itemPrice:    { fontFamily: theme.fonts.ui, fontSize: 14, fontWeight: 600, color: theme.colors.muted, minWidth: 72, textAlign: 'right' },
  stepper:      { display: 'flex', alignItems: 'center', gap: 12 },
  stepBtn:      { width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${theme.colors.accent}`, backgroundColor: 'transparent', color: theme.colors.accent, fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.ui },
  stepQty:      { fontFamily: theme.fonts.ui, fontSize: 15, fontWeight: 600, color: theme.colors.onPrimary, minWidth: 20, textAlign: 'center' },
  sizeRow:      { display: 'flex', gap: 8, marginTop: 12, paddingLeft: 2 },
  sizeBtn:      { fontFamily: theme.fonts.ui, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 3, border: `1.5px solid ${theme.colors.accent}`, cursor: 'pointer', transition: 'background 0.15s, color 0.15s' },

  // Right recap
  recap:        { flex: '0 0 30%', position: 'sticky', top: 0, backgroundColor: 'rgba(42,31,21,0.03)', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 },
  recapTitle:   { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary, letterSpacing: '0.04em', marginBottom: 4 },
  lineList:     { display: 'flex', flexDirection: 'column', gap: 6, minHeight: 40 },
  emptyLines:   { fontFamily: theme.fonts.ui, fontSize: 12, color: theme.colors.muted, letterSpacing: '0.08em', fontStyle: 'italic' },
  lineRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  lineName:     { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onPrimary },
  lineTotal:    { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 600, color: theme.colors.onPrimary, whiteSpace: 'nowrap' },
  totalRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(42,31,21,0.1)' },
  totalLabel:   { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.muted },
  totalValue:   { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary, letterSpacing: '0.03em' },
  divider:      { height: 1, backgroundColor: 'rgba(42,31,21,0.1)', margin: '4px 0' },
  field:        { display: 'flex', flexDirection: 'column', gap: 4 },
  fieldLabel:   { fontFamily: theme.fonts.ui, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.muted },
  input:        { fontFamily: theme.fonts.ui, fontSize: 14, color: theme.colors.onPrimary, backgroundColor: 'white', border: '1px solid rgba(42,31,21,0.18)', borderRadius: 4, padding: '10px 12px', outline: 'none' },
  toggleRow:    { display: 'flex', gap: 8 },
  toggleBtn:    { flex: 1, fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', padding: '10px 0', borderRadius: 4, border: `1.5px solid ${theme.colors.accent}`, cursor: 'pointer', transition: 'background 0.15s, color 0.15s' },
  validateBtn:  { marginTop: 8, padding: '18px 0', fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', borderRadius: 4, backgroundColor: theme.colors.accent, color: theme.colors.onSecondary, width: '100%' },
}
