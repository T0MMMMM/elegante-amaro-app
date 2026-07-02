import { useEffect, useMemo, useState } from 'react'
import { createCommand, deleteCommand, getCommands, updateCommand } from '../api/commands'
import { getCommandTypes }   from '../api/commandTypes'
import { getStateCommands }  from '../api/stateCommands'
import { getTables }         from '../api/tables'
import { getUsers }          from '../api/users'
import { useResource }       from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Select } from '../components/ui/Modal'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'
import PageShell from '../components/ui/PageShell'
import { renderDate } from '../utils/formatDate'
import { theme } from '@elegante-amaro-app/shared/constants'
import { formatOrderNumber } from '@elegante-amaro-app/shared/utils'
import type { Command, CommandType, StateCommand, Table, User } from '@elegante-amaro-app/shared/types'

const emptyForm = { user_id: 0, table_id: 0, type_id: 0, state_command_id: 0, tva_rate: 20, total_price: 0 }

type SortKey = 'id' | 'user_id' | 'total_price' | 'created_at' | 'updated_at'

export default function Commands() {
  const { data, loading, error, setData } = useResource(getCommands)

  const [tables,        setTables]        = useState<Table[]>([])
  const [users,         setUsers]         = useState<User[]>([])
  const [stateCommands, setStateCommands] = useState<StateCommand[]>([])
  const [commandTypes,  setCommandTypes]  = useState<CommandType[]>([])

  useEffect(() => {
    // includeDeleted=true : on doit pouvoir résoudre le nom d'un utilisateur /
    // le numéro d'une table supprimés pour les commandes de l'historique.
    Promise.all([getTables(true), getUsers(true), getStateCommands(true), getCommandTypes()])
      .then(([t, u, sc, ct]) => { setTables(t); setUsers(u); setStateCommands(sc); setCommandTypes(ct) })
      .catch(() => {})
  }, [])

  const [statusFilter, setStatusFilter] = useState<number[]>([])
  const [typeFilter,   setTypeFilter]   = useState<number[]>([])
  // Par défaut : les commandes les plus récentes en premier.
  const [sortKey, setSortKey] = useState<SortKey | null>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const sortValue = (row: Command, key: SortKey): number | string => {
    switch (key) {
      case 'id':           return row.id
      case 'user_id':      return users.find(u => u.id === row.user_id)?.name ?? ''
      case 'total_price':  return Number(row.total_price)
      case 'created_at':   return new Date(row.created_at).getTime()
      case 'updated_at':   return new Date(row.updated_at).getTime()
    }
  }

  const displayedData = useMemo(() => {
    let rows = data
    if (statusFilter.length) rows = rows.filter(c => statusFilter.includes(c.state_command_id))
    if (typeFilter.length)   rows = rows.filter(c => typeFilter.includes(c.type_id))

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = sortValue(a, sortKey)
        const vb = sortValue(b, sortKey)
        const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [data, statusFilter, typeFilter, sortKey, sortDir, users])

  const columns: Column<Command>[] = useMemo(() => [
    {
      key: 'id', label: 'N° commande', width: 120,
      render: (_v, row) => row.code ?? formatOrderNumber(row.id),
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'user_id', label: 'Utilisateur', width: '18%',
      render: v => users.find(u => u.id === v)?.name ?? String(v),
      sortable: true,
      sortDirection: (sortKey === 'user_id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('user_id'),
    },
    {
      key: 'state_command_id', label: 'Statut', width: '16%',
      render: v => <span style={{ textTransform: 'uppercase' }}>{stateCommands.find(s => s.id === v)?.state ?? String(v)}</span>,
      filter: {
        options: stateCommands.map(s => ({ value: s.id, label: s.state })),
        selected: statusFilter,
        onChange: values => setStatusFilter(values as number[]),
      },
    },
    {
      key: 'type_id', label: 'Type', width: '16%',
      render: (v, row) => {
        const type = commandTypes.find(t => t.id === v)
        if (type?.name === 'sur place') {
          const table = tables.find(t => t.id === row.table_id)
          return <span style={styles.badgeTable}>{table ? `Table ${table.numero}` : 'Table —'}</span>
        }
        return <span style={styles.badgeTakeaway}>À emporter</span>
      },
      filter: {
        options: commandTypes.map(t => ({ value: t.id, label: t.name === 'sur place' ? 'Table' : 'À emporter' })),
        selected: typeFilter,
        onChange: values => setTypeFilter(values as number[]),
      },
    },
    {
      key: 'total_price', label: 'Total', width: 90,
      render: v => `${Number(v).toFixed(2)} €`,
      sortable: true,
      sortDirection: (sortKey === 'total_price' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('total_price'),
    },
    {
      key: 'created_at', label: 'Créée le', width: 90,
      render: renderDate,
      sortable: true,
      sortDirection: (sortKey === 'created_at' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('created_at'),
    },
    {
      key: 'updated_at', label: 'Modifiée le', width: 90,
      render: renderDate,
      sortable: true,
      sortDirection: (sortKey === 'updated_at' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('updated_at'),
    },
  ], [tables, users, stateCommands, commandTypes, statusFilter, typeFilter, sortKey, sortDir])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Command | null>(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const openEdit = (row: Command) => {
    setEditing(row)
    setForm({ user_id: row.user_id, table_id: row.table_id, type_id: row.type_id, state_command_id: row.state_command_id, tva_rate: row.tva_rate, total_price: row.total_price })
    setModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!editing) return
    await deleteCommand(editing.id)
    setData(prev => prev.filter(c => c.id !== editing.id))
    setConfirmDeleteOpen(false)
    setModalOpen(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateCommand(editing.id, form)
        setData(prev => prev.map(c => c.id === updated.id ? updated : c))
      } else {
        const created = await createCommand(form)
        setData(prev => [...prev, created])
      }
      setModalOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: Number(e.target.value) }))

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Commandes</h1>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? `Modifier commande #${editing.id}` : 'Nouvelle commande'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? () => setConfirmDeleteOpen(true) : undefined}
        >
          <Field label="Utilisateur">
            <Select value={form.user_id} onChange={set('user_id')}>
              <option value={0}>— Choisir un utilisateur —</option>
              {users
                .filter(u => !u.deleted_at || u.id === form.user_id)
                .map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          </Field>

          <Field label="Table">
            <Select value={form.table_id} onChange={set('table_id')}>
              <option value={0}>— Choisir une table —</option>
              {tables.map(t => <option key={t.id} value={t.id}>Table {t.numero}</option>)}
            </Select>
          </Field>

          <Field label="Type de commande">
            <Select value={form.type_id} onChange={set('type_id')}>
              <option value={0}>— Choisir un type —</option>
              {commandTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
            </Select>
          </Field>

          <Field label="Statut">
            <Select value={form.state_command_id} onChange={set('state_command_id')}>
              <option value={0}>— Choisir un statut —</option>
              {stateCommands
                .filter(sc => !sc.deleted_at || sc.id === form.state_command_id)
                .map(sc => <option key={sc.id} value={sc.id}>{sc.state}</option>)}
            </Select>
          </Field>

          <Field label="TVA (%)">
            <Select value={form.tva_rate} onChange={set('tva_rate')}>
              <option value={5.5}>5,5 %</option>
              <option value={10}>10 %</option>
              <option value={20}>20 %</option>
            </Select>
          </Field>
        </Modal>
      )}

      {confirmDeleteOpen && editing && (
        <ConfirmDeleteModal
          title="Supprimer la commande"
          message={`Voulez-vous vraiment supprimer la commande #${editing.id} ?`}
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
  badgeTable: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 12,
    fontFamily: theme.fonts.ui,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: theme.colors.accent,
    color: theme.colors.onSecondary,
  },
  badgeTakeaway: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 12,
    fontFamily: theme.fonts.ui,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.colors.muted}`,
    color: theme.colors.muted,
  },
}
