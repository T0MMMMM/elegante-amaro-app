# Dashboard Refactor + New Command Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the dashboard with 4 fixed stat blocks + action buttons, fix the active orders bug, rename the Commands page to "Historique des commandes", and add a full new command creation page with a 70/30 split layout.

**Architecture:** All changes are in the React frontend (`apps/web/src`). The API already has all necessary routes. The new command page calls existing endpoints: `GET /items`, `GET /categories`, `GET /users`, `GET /tables`, `POST /commands`, `POST /commands-items`. No backend changes needed except adding a `create` method to `commandItemsService` on the frontend.

**Tech Stack:** React 18, React Router v6, TypeScript, inline styles following existing `theme` constants from `@elegante-amaro-app/shared/constants`.

## Global Constraints

- All styles use `theme.colors`, `theme.fonts` from `@elegante-amaro-app/shared/constants` — no hardcoded hex colors except those already in the codebase (`rgba(42,31,21,...)` patterns).
- No CSS files — inline styles only, following existing file conventions.
- No new dependencies.
- State names from DB: `"en attente"`, `"en préparation"`, `"prête"`, `"livrée"`, `"annulée"`. Terminal states = `["livrée", "annulée"]`.
- The `commandItemsService` `create` call must match the API route `POST /commands-items`.
- Both `Sidebar.tsx` and `NavMenu.tsx` have their own `links` array — both must be updated when renaming nav labels.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/web/src/pages/Dashboard.tsx` | Modify | 4-stat row, active orders bug fix, action section |
| `apps/web/src/pages/Commands.tsx` | Modify | Rename title h1 only |
| `apps/web/src/components/layout/Sidebar.tsx` | Modify | Rename nav link |
| `apps/web/src/components/layout/NavMenu.tsx` | Modify | Rename nav link |
| `apps/web/src/services/commandItems.service.ts` | Modify | Add `create` method |
| `apps/web/src/pages/NewCommand.tsx` | Create | 70/30 split command creation page |
| `apps/web/src/App.tsx` | Modify | Add `/new-command` route |

---

## Task 1: Fix Dashboard — 4 stat blocks + active orders bug

**Files:**
- Modify: `apps/web/src/pages/Dashboard.tsx`

**Context:** Two bugs exist in the current code:
1. `lastState = states[states.length - 1]` (="annulée") is the only terminal state → "livrée" orders appear as active.
2. The stats row is dynamic (one block per DB state) but the user wants exactly 4 fixed blocks.

The `DayStat` component already exists in the file and can be reused. The `StatBlock` component handles numeric values. The CA block shows a formatted euro string — it reuses `DayStat` (which accepts `value: string`).

**Interfaces:**
- Produces: `TERMINAL_STATES: string[]`, inline in component — used only within this file.

- [ ] **Step 1: Replace the stat computation block**

In `Dashboard.tsx`, find the section starting at line 224 (`const lastState = states[states.length - 1]`) and replace through the end of the `counts` object (line ~239) with:

```tsx
const TERMINAL = ['livrée', 'annulée']

const todayStr     = today()
const todayOrders  = orders.filter(o => o.createdAt.toDateString() === todayStr)
const activeOrders = todayOrders.filter(o => {
  const stateName = states.find(s => s.id === o.statusId)?.state ?? ''
  return !TERMINAL.includes(stateName)
})
const servedOrders = todayOrders.filter(o => {
  const stateName = states.find(s => s.id === o.statusId)?.state ?? ''
  return stateName === 'livrée'
})
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

const countActive  = activeOrders.length
const countPending = activeOrders.filter(o => states.find(s => s.id === o.statusId)?.state === 'en attente').length
const countReady   = activeOrders.filter(o => states.find(s => s.id === o.statusId)?.state === 'prête').length
const ca           = servedOrders.reduce((s, o) => s + Number(o.total), 0)
const fmt          = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
```

- [ ] **Step 2: Replace the stats row JSX**

Find the `{/* ── Active stats ──` block and replace the entire `<div style={styles.statsRow}>` with:

```tsx
{/* ── 4 stat blocks ──────────────────────────────────── */}
<div style={styles.statsRow}>
  <StatBlock value={countActive}  label="Actives" />
  <div style={styles.statSep} />
  <StatBlock value={countPending} label="En attente" dim />
  <div style={styles.statSep} />
  <DayStat value={fmt(ca)}        label="CA du jour" />
  <div style={styles.statSep} />
  <StatBlock value={countReady}   label="Prêtes" dim />
</div>
```

- [ ] **Step 3: Fix the active orders section**

The active orders section currently maps over `activeStates` (all non-last states). Replace it with a map over the non-terminal states identified by name:

```tsx
const displayStates = states.filter(s => !TERMINAL.includes(s.state))
```

Add this line right after the `countReady` line. Then in the JSX, change `activeStates.map(state => {` to `displayStates.map(state => {`.

Also update the `nextState` logic in the map — the advance button should stop before "livrée":

```tsx
const stateIdx = displayStates.findIndex(s => s.id === state.id)
const nextState = displayStates[stateIdx + 1]
  ?? states.find(s => s.state === 'livrée')
  ?? null
```

- [ ] **Step 4: Remove the old day stats row**

Delete the entire `{/* ── Day stats + history ──` block's `<div style={styles.dayStatsRow}>` section (the four `DayStat` blocks with the separators). Keep the `historySeparator` div and the served orders history below it.

- [ ] **Step 5: Update the `statSep` style to match DayStat height**

`DayStat` has a larger font (48px) so the separator needs to be taller. In the `styles` object, change:

```ts
statSep: { width: 1, height: 56, backgroundColor: 'rgba(42,31,21,0.08)' },
```
to:
```ts
statSep: { width: 1, height: 72, backgroundColor: 'rgba(42,31,21,0.08)' },
```

- [ ] **Step 6: Verify visually**

Run the dev server and open `/dashboard`. Confirm:
- 4 blocks visible: "Actives", "En attente", "CA du jour", "Prêtes"
- No crash when orders exist or when list is empty
- Active orders section only shows non-terminal orders

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/pages/Dashboard.tsx
git commit -m "fix(dashboard): 4 fixed stat blocks + active orders terminal state fix"
```

---

## Task 2: Add action section to Dashboard

**Files:**
- Modify: `apps/web/src/pages/Dashboard.tsx`

**Context:** Two brown CTA buttons, side by side, full width. Must use `useNavigate` from `react-router`. The brown color is `theme.colors.accent`.

- [ ] **Step 1: Add `useNavigate` import**

The file already imports from `react` but not `useNavigate`. Add it:

```tsx
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
```

- [ ] **Step 2: Add navigate in the component body**

Inside the `Dashboard` function, right after the state declarations:

```tsx
const navigate = useNavigate()
```

- [ ] **Step 3: Add the action section JSX**

Insert this block right before the `{/* ── Day stats + history */}` separator div (i.e., after the active orders section):

```tsx
{/* ── Actions ────────────────────────────────────────── */}
<div style={styles.actionsRow}>
  <ActionBtn label="Créer une commande" onClick={() => navigate('/new-command')} />
  <ActionBtn label="Historique des commandes" onClick={() => navigate('/commands')} />
</div>
```

- [ ] **Step 4: Add the `ActionBtn` sub-component**

Add this component near the top of the file, alongside `StatBlock` and `DayStat`:

```tsx
function ActionBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        padding: '22px 0',
        fontFamily: theme.fonts.ui,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        transition: 'background 0.15s, opacity 0.15s',
        backgroundColor: hov ? theme.colors.secondary : theme.colors.accent,
        color: theme.colors.onSecondary,
        opacity: hov ? 0.88 : 1,
      }}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 5: Add `actionsRow` style**

```ts
actionsRow: { display: 'flex', gap: 16, marginTop: 48, marginBottom: 8 },
```

- [ ] **Step 6: Verify visually**

Open `/dashboard`. Confirm two brown buttons appear side by side below the active orders. Clicking "Créer une commande" navigates to `/new-command` (404 is OK at this stage). Clicking "Historique des commandes" navigates to `/commands`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/pages/Dashboard.tsx
git commit -m "feat(dashboard): add action section with Créer/Historique buttons"
```

---

## Task 3: Rename Commands page + update nav

**Files:**
- Modify: `apps/web/src/pages/Commands.tsx`
- Modify: `apps/web/src/components/layout/Sidebar.tsx`
- Modify: `apps/web/src/components/layout/NavMenu.tsx`

- [ ] **Step 1: Rename the title in Commands.tsx**

Find line 84:
```tsx
<h1 style={styles.pageTitle}>Commandes</h1>
```
Replace with:
```tsx
<h1 style={styles.pageTitle}>Historique des commandes</h1>
```

- [ ] **Step 2: Update Sidebar nav link**

In `Sidebar.tsx`, in the `links` array, change:
```ts
{ to: '/commands', label: 'Commandes' },
```
to:
```ts
{ to: '/commands', label: 'Historique' },
```
(Short label for sidebar, which is space-constrained.)

- [ ] **Step 3: Update NavMenu nav link**

In `NavMenu.tsx`, in the `links` array, change:
```ts
{ to: '/commands', label: 'Commandes' },
```
to:
```ts
{ to: '/commands', label: 'Historique' },
```

- [ ] **Step 4: Verify visually**

Navigate to `/commands` — confirm the h1 shows "Historique des commandes". Confirm sidebar shows "Historique".

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/pages/Commands.tsx apps/web/src/components/layout/Sidebar.tsx apps/web/src/components/layout/NavMenu.tsx
git commit -m "feat: rename Commands page to Historique des commandes"
```

---

## Task 4: Add `create` to commandItemsService

**Files:**
- Modify: `apps/web/src/services/commandItems.service.ts`

**Context:** The API route `POST /commands-items` already exists (routes.js line 82). The `CommandItem` type is: `{ id, item_id, command_id, quantity, unit_price, line_total, size }`. The `size` field is `CommandSize = 'petit' | 'moyen' | 'grand'`.

**Interfaces:**
- Produces: `commandItemsService.create(data: Omit<CommandItem, 'id'>) => Promise<CommandItem>`

- [ ] **Step 1: Add the create method**

Replace the entire file content:

```ts
import type { CommandItem } from '@elegante-amaro-app/shared/types'
import { http } from './client'

export const commandItemsService = {
  getAll:       ()                                    => http.get<CommandItem[]>('/commands-items'),
  getByCommand: (id: number)                          => http.get<CommandItem[]>(`/commands/${id}/items`),
  create:       (data: Omit<CommandItem, 'id'>)       => http.post<CommandItem>('/commands-items', data),
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/services/commandItems.service.ts
git commit -m "feat(service): add create method to commandItemsService"
```

---

## Task 5: Create NewCommand page

**Files:**
- Create: `apps/web/src/pages/NewCommand.tsx`

**Context:** This page has a 70/30 split. Left panel: item catalog by category with quantity steppers. Right panel: order summary, customer fields, table dropdown, validate button.

**Data fetched:** items (`itemsService.getAll()`), categories (`categoriesService.getAll()`), tables (`tablesService.getAll()`), users (`usersService.getAll()` — used to find or create user by email).

**On validate:**
1. Find user in fetched list whose `email === form.email`. If not found, call `usersService.create({ name: form.prenom + ' ' + form.nom, email: form.email, password_hash: '', fidelity_points: 0, roles: [] })`.
2. Call `commandsService.create({ user_id, table_id: form.tableId, type_id: 1, state_command_id: 1, tva_rate: 10, total_price })`.
3. For each item with `qty > 0`, call `commandItemsService.create({ command_id: cmd.id, item_id, quantity: qty, unit_price: item.price, line_total: qty * item.price, size: 'moyen' })`.
4. `navigate('/dashboard')`.

**Interfaces:**
- Consumes: `itemsService.getAll()`, `categoriesService.getAll()`, `tablesService.getAll()`, `usersService.getAll()`, `usersService.create()`, `commandsService.create()`, `commandItemsService.create()`

- [ ] **Step 1: Create the file with imports and types**

```tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { theme } from '@elegante-amaro-app/shared/constants'
import { itemsService }        from '../services/items.service'
import { categoriesService }   from '../services/categories.service'
import { tablesService }       from '../services/tables.service'
import { usersService }        from '../services/users.service'
import { commandsService }     from '../services/commands.service'
import { commandItemsService } from '../services/commandItems.service'
import type { Item, Category, Table, User } from '@elegante-amaro-app/shared/types'

interface OrderLine { item: Item; qty: number }
```

- [ ] **Step 2: Write the component state and data loading**

```tsx
export default function NewCommand() {
  const navigate = useNavigate()

  const [items,      setItems]      = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tables,     setTables]     = useState<Table[]>([])
  const [users,      setUsers]      = useState<User[]>([])
  const [quantities, setQuantities] = useState<Record<number, number>>({}) // item_id → qty
  const [form, setForm]             = useState({ prenom: '', nom: '', email: '', tableId: 0 })
  const [saving, setSaving]         = useState(false)
  const [loadError, setLoadError]   = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      itemsService.getAll(),
      categoriesService.getAll(),
      tablesService.getAll(),
      usersService.getAll(),
    ])
      .then(([i, c, t, u]) => { setItems(i); setCategories(c); setTables(t); setUsers(u) })
      .catch(() => setLoadError('Impossible de charger les données'))
  }, [])

  const setQty = (itemId: number, delta: number) =>
    setQuantities(prev => {
      const next = Math.max(0, (prev[itemId] ?? 0) + delta)
      if (next === 0) { const { [itemId]: _, ...rest } = prev; return rest }
      return { ...prev, [itemId]: next }
    })

  const lines: OrderLine[] = items
    .filter(i => (quantities[i.id] ?? 0) > 0)
    .map(i => ({ item: i, qty: quantities[i.id] }))

  const total = lines.reduce((s, l) => s + l.item.price * l.qty, 0)
  const fmt   = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
```

- [ ] **Step 3: Write the validate handler**

```tsx
  const handleValidate = async () => {
    if (!form.prenom.trim() || !form.nom.trim() || !form.email.trim() || !form.tableId) {
      alert('Veuillez remplir tous les champs et sélectionner une table.')
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
      const cmd = await commandsService.create({
        user_id: user.id,
        table_id: form.tableId,
        type_id: 1,
        state_command_id: 1,
        tva_rate: 10,
        total_price: total,
      })
      await Promise.all(lines.map(l =>
        commandItemsService.create({
          command_id: cmd.id,
          item_id: l.item.id,
          quantity: l.qty,
          unit_price: l.item.price,
          line_total: l.item.price * l.qty,
          size: 'moyen',
        })
      ))
      navigate('/dashboard')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la création de la commande')
    } finally {
      setSaving(false)
    }
  }
```

- [ ] **Step 4: Write the left panel JSX (item catalog)**

```tsx
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
                const qty = quantities[item.id] ?? 0
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
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemPrice}>{fmt(item.price)}</span>
                    <div style={styles.stepper}>
                      <button style={styles.stepBtn} onClick={() => setQty(item.id, -1)}>−</button>
                      <span style={styles.stepQty}>{qty}</span>
                      <button style={styles.stepBtn} onClick={() => setQty(item.id, +1)}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
```

- [ ] **Step 5: Write the right panel JSX (recap + form)**

```tsx
      {/* ── Right: recap ────────────────────────────────── */}
      <div style={styles.recap}>
        <span style={styles.recapTitle}>Récapitulatif</span>

        <div style={styles.lineList}>
          {lines.length === 0
            ? <span style={styles.emptyLines}>Aucun article sélectionné</span>
            : lines.map(l => (
                <div key={l.item.id} style={styles.lineRow}>
                  <span style={styles.lineName}>{l.item.name} × {l.qty}</span>
                  <span style={styles.lineTotal}>{fmt(l.item.price * l.qty)}</span>
                </div>
              ))
          }
        </div>

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total TTC</span>
          <span style={styles.totalValue}>{fmt(total)}</span>
        </div>

        <div style={styles.divider} />

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
```

- [ ] **Step 6: Add the styles object**

```tsx
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
  itemRow:      { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 12px', transition: 'background 0.15s, border-color 0.15s' },
  itemName:     { flex: 1, fontFamily: theme.fonts.body, fontSize: 16, color: theme.colors.onPrimary },
  itemPrice:    { fontFamily: theme.fonts.ui, fontSize: 14, fontWeight: 600, color: theme.colors.muted, minWidth: 72, textAlign: 'right' },
  stepper:      { display: 'flex', alignItems: 'center', gap: 12 },
  stepBtn:      { width: 32, height: 32, borderRadius: '50%', border: `1.5px solid ${theme.colors.accent}`, backgroundColor: 'transparent', color: theme.colors.accent, fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: theme.fonts.ui },
  stepQty:      { fontFamily: theme.fonts.ui, fontSize: 15, fontWeight: 600, color: theme.colors.onPrimary, minWidth: 20, textAlign: 'center' },

  // Right recap
  recap:        { flex: '0 0 30%', position: 'sticky', top: 0, backgroundColor: 'rgba(42,31,21,0.03)', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 12 },
  recapTitle:   { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary, letterSpacing: '0.04em', marginBottom: 4 },
  lineList:     { display: 'flex', flexDirection: 'column', gap: 6, minHeight: 40 },
  emptyLines:   { fontFamily: theme.fonts.ui, fontSize: 12, color: theme.colors.muted, letterSpacing: '0.08em', fontStyle: 'italic' },
  lineRow:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  lineName:     { fontFamily: theme.fonts.body, fontSize: 14, color: theme.colors.onPrimary },
  lineTotal:    { fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 600, color: theme.colors.onPrimary },
  totalRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(42,31,21,0.1)' },
  totalLabel:   { fontFamily: theme.fonts.ui, fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: theme.colors.muted },
  totalValue:   { fontFamily: theme.fonts.title, fontSize: 28, color: theme.colors.onPrimary, letterSpacing: '0.03em' },
  divider:      { height: 1, backgroundColor: 'rgba(42,31,21,0.1)', margin: '4px 0' },
  field:        { display: 'flex', flexDirection: 'column', gap: 4 },
  fieldLabel:   { fontFamily: theme.fonts.ui, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.colors.muted },
  input:        { fontFamily: theme.fonts.ui, fontSize: 14, color: theme.colors.onPrimary, backgroundColor: 'white', border: '1px solid rgba(42,31,21,0.18)', borderRadius: 4, padding: '10px 12px', outline: 'none' },
  validateBtn:  { marginTop: 8, padding: '18px 0', fontFamily: theme.fonts.ui, fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', border: 'none', borderRadius: 4, backgroundColor: theme.colors.accent, color: theme.colors.onSecondary, width: '100%' },
}
```

- [ ] **Step 7: Check the `categoriesService` import path**

Look at `apps/web/src/services/index.ts` to confirm the export name. The import `{ categoriesService }` must match the export. If the service exports as `categoriesService`, use that. Check `apps/web/src/services/categories.service.ts` for the export name and adjust the import in `NewCommand.tsx` accordingly.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/pages/NewCommand.tsx
git commit -m "feat: add NewCommand page with 70/30 split layout"
```

---

## Task 6: Wire routing

**Files:**
- Modify: `apps/web/src/App.tsx`

- [ ] **Step 1: Add the import**

In `App.tsx`, add:
```tsx
import NewCommand from './pages/NewCommand'
```
alongside the other page imports.

- [ ] **Step 2: Add the route**

Inside the `<Route element={<Layout />}>` block, add:
```tsx
<Route path="/new-command" element={<NewCommand />} />
```

- [ ] **Step 3: Verify end-to-end**

1. Open `/dashboard` → click "Créer une commande" → confirm the new page loads with left catalog and right recap panel.
2. Select some items → confirm they appear in the recap with the running total.
3. Fill in Prénom, Nom, Email, select a table → click "Valider la commande" → confirm navigation back to `/dashboard`.
4. Check `/commands` (historique) → confirm the new command appears in the table.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/App.tsx
git commit -m "feat: add /new-command route"
```
