import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { createStateCommand, deleteStateCommand, getStateCommands, updateStateCommand } from '../api/stateCommands'
import { useResource } from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { StateCommand } from '@elegante-amaro-app/shared/types'

type SortKey = 'id' | 'state'

export default function StateCommands() {
  const navigate = useNavigate()
  const { data, loading, error, setData } = useResource(getStateCommands)

  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const positionOrder = useMemo(
    () => [...data].sort((a, b) => (a.position ?? a.id) - (b.position ?? b.id)),
    [data]
  )

  const displayedData = useMemo(() => {
    if (!sortKey) return positionOrder
    return [...data].sort((a, b) => {
      const cmp = sortKey === 'state' ? a.state.localeCompare(b.state) : a.id - b.id
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir, positionOrder])

  const moveStatus = async (row: StateCommand, direction: -1 | 1) => {
    const idx = positionOrder.findIndex(s => s.id === row.id)
    const swapIdx = idx + direction
    if (idx === -1 || swapIdx < 0 || swapIdx >= positionOrder.length) return
    const a = positionOrder[idx]
    const b = positionOrder[swapIdx]
    const aPos = a.position ?? a.id
    const bPos = b.position ?? b.id
    const [updatedA, updatedB] = await Promise.all([
      updateStateCommand(a.id, { position: bPos }),
      updateStateCommand(b.id, { position: aPos }),
    ])
    setData(prev => prev.map(s => s.id === updatedA.id ? updatedA : s.id === updatedB.id ? updatedB : s))
  }

  const columns: Column<StateCommand>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 80,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'state', label: 'Statut', width: '40%',
      sortable: true,
      sortDirection: (sortKey === 'state' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('state'),
      render: (v) => <span style={styles.upper}>{v as string}</span>,
    },
    {
      key: 'color', label: 'Couleur', width: 90,
      render: (v) => (
        <span style={{ ...styles.colorSwatch, backgroundColor: (v as string) || theme.colors.surface }} />
      ),
    },
    {
      key: 'icon', label: 'Raccourci', width: 130,
      render: (_v, row) => (
        <span style={styles.upper}>{row.quick_action_enabled ? (row.icon || row.state).slice(0, 12) : '—'}</span>
      ),
    },
    {
      key: 'hidden_in_board', label: 'Suivi commandes', width: 130,
      render: (_v, row) => (
        <span>{row.hidden_in_board ? 'Masqué' : 'Visible'}</span>
      ),
    },
    {
      key: 'id', label: 'Ordre', width: 90,
      render: (_v, row) => {
        const idx = positionOrder.findIndex(s => s.id === row.id)
        return (
          <span style={styles.orderBtns}>
            <button
              type="button" aria-label="Monter" style={styles.orderBtn}
              disabled={idx <= 0}
              onClick={() => moveStatus(row, -1)}
            >▲</button>
            <button
              type="button" aria-label="Descendre" style={styles.orderBtn}
              disabled={idx === -1 || idx >= positionOrder.length - 1}
              onClick={() => moveStatus(row, 1)}
            >▼</button>
          </span>
        )
      },
    },
  ], [sortKey, sortDir, positionOrder])

  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<StateCommand | null>(null)
  const emptyForm = { state: '', color: '', quick_action_enabled: false, icon: '', hidden_in_board: false }
  const [form, setForm]                   = useState(emptyForm)
  const [saving, setSaving]               = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit   = (row: StateCommand) => {
    setEditing(row)
    setForm({
      state: row.state,
      color: row.color ?? '',
      quick_action_enabled: row.quick_action_enabled ?? false,
      icon: row.icon ?? '',
      hidden_in_board: row.hidden_in_board ?? false,
    })
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editing) return
    await deleteStateCommand(editing.id)
    setData(prev => prev.filter(s => s.id !== editing.id))
    setConfirmDeleteOpen(false)
    setModalOpen(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateStateCommand(editing.id, form)
        setData(prev => prev.map(s => s.id === updated.id ? updated : s))
      } else {
        const created = await createStateCommand(form)
        setData(prev => [...prev, created])
      }
      setModalOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Statuts</h1>
        <span style={styles.headerActions}>
          <Button variant="ghost" onClick={() => navigate('/commands-board')}>Suivi des commandes</Button>
          <Button onClick={openCreate}>+ Nouveau</Button>
        </span>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier statut' : 'Nouveau statut'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? () => setConfirmDeleteOpen(true) : undefined}
        >
          <Field label="Statut">
            <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
          </Field>
          <Field label="Couleur de bordure (tableau de suivi)">
            <span style={styles.colorField}>
              <input
                type="color"
                value={form.color || '#F5EDD8'}
                onChange={e => setForm({ ...form, color: e.target.value })}
                style={styles.colorInput}
              />
              <Button variant="ghost" onClick={() => setForm({ ...form, color: '' })}>
                Réinitialiser
              </Button>
            </span>
          </Field>
          <Field label="Bouton raccourci">
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.quick_action_enabled}
                onChange={e => setForm({ ...form, quick_action_enabled: e.target.checked })}
              />
              Ajouter un bouton sur chaque commande pour la basculer directement vers ce statut
            </label>
          </Field>
          <Field label="Visibilité">
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.hidden_in_board}
                onChange={e => setForm({ ...form, hidden_in_board: e.target.checked })}
              />
              Masquer ce statut dans le suivi des commandes (colonne non affichée)
            </label>
          </Field>
          {form.quick_action_enabled && (
            <Field label="Texte du bouton (12 caractères max, par défaut le nom du statut)">
              <span style={styles.colorField}>
                <Input
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value.slice(0, 12) })}
                  placeholder={form.state.slice(0, 12) || 'Texte du bouton'}
                />
                <Button variant="ghost" onClick={() => setForm({ ...form, icon: '' })}>
                  Réinitialiser
                </Button>
              </span>
            </Field>
          )}
        </Modal>
      )}

      {confirmDeleteOpen && editing && (
        <ConfirmDeleteModal
          title="Supprimer le statut"
          message={`Voulez-vous vraiment supprimer le statut "${editing.state}" ? Il ne sera plus proposé pour les commandes. Suppression impossible s'il est encore utilisé dans l'historique.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontFamily: theme.fonts.title, fontSize: 40, color: theme.colors.onPrimary, letterSpacing: '0.04em' },
  headerActions: { display: 'flex', gap: 12 },
  orderBtns: { display: 'inline-flex', gap: 4 },
  orderBtn: {
    background: 'none',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 11,
    color: theme.colors.onPrimary,
    padding: '4px 8px',
    lineHeight: 1,
  },
  upper: { textTransform: 'uppercase' },
  colorSwatch: {
    display: 'inline-block',
    width: 22,
    height: 22,
    borderRadius: 5,
    border: `1px solid ${theme.colors.border}`,
  },
  colorField: { display: 'flex', alignItems: 'center', gap: 12 },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.onPrimary,
    cursor: 'pointer',
  },
  colorInput: {
    width: 48,
    height: 38,
    padding: 2,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: 4,
    cursor: 'pointer',
    backgroundColor: theme.colors.primary,
  },
}
