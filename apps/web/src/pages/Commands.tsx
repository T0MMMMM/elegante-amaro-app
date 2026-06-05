import { useEffect, useMemo, useState } from 'react'
import { createCommand, deleteCommand, getCommands, updateCommand } from '../api/commands'
import { getCommandTypes }   from '../api/commandTypes'
import { getStateCommands }  from '../api/stateCommands'
import { getTables }         from '../api/tables'
import { getUsers }          from '../api/users'
import { useResource }       from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Select } from '../components/ui/Modal'
import Button    from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Command, CommandType, StateCommand, Table, User } from '@elegante-amaro-app/shared/types'

const emptyForm = { user_id: 0, table_id: 0, type_id: 0, state_command_id: 0, tva_rate: 20, total_price: 0 }

export default function Commands() {
  const { data, loading, error, setData } = useResource(getCommands)

  const [tables,        setTables]        = useState<Table[]>([])
  const [users,         setUsers]         = useState<User[]>([])
  const [stateCommands, setStateCommands] = useState<StateCommand[]>([])
  const [commandTypes,  setCommandTypes]  = useState<CommandType[]>([])

  useEffect(() => {
    Promise.all([getTables(), getUsers(), getStateCommands(), getCommandTypes()])
      .then(([t, u, sc, ct]) => { setTables(t); setUsers(u); setStateCommands(sc); setCommandTypes(ct) })
      .catch(() => {})
  }, [])

  const columns: Column<Command>[] = useMemo(() => [
    { key: 'id', label: 'ID' },
    { key: 'user_id',          label: 'Utilisateur', render: v => users.find(u => u.id === v)?.name         ?? String(v) },
    { key: 'table_id',         label: 'Table',       render: v => { const t = tables.find(t => t.id === v); return t ? `Table ${t.numero}` : String(v) } },
    { key: 'state_command_id', label: 'Statut',      render: v => stateCommands.find(s => s.id === v)?.state ?? String(v) },
    { key: 'type_id',          label: 'Type',        render: v => commandTypes.find(c => c.id === v)?.name   ?? String(v) },
    { key: 'total_price', label: 'Total',    render: v => `${Number(v).toFixed(2)} €` },
    { key: 'created_at',  label: 'Créée le', render: v => new Date(String(v)).toLocaleDateString('fr-FR') },
  ], [tables, users, stateCommands, commandTypes])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Command | null>(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit   = (row: Command) => {
    setEditing(row)
    setForm({ user_id: row.user_id, table_id: row.table_id, type_id: row.type_id, state_command_id: row.state_command_id, tva_rate: row.tva_rate, total_price: row.total_price })
    setModalOpen(true)
  }

  const handleDelete = async (row: Command) => {
    if (!confirm(`Supprimer la commande #${row.id} ?`)) return
    await deleteCommand(row.id)
    setData(prev => prev.filter(c => c.id !== row.id))
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
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? `Modifier commande #${editing.id}` : 'Nouvelle commande'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Utilisateur">
            <Select value={form.user_id} onChange={set('user_id')}>
              <option value={0}>— Choisir un utilisateur —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
              {stateCommands.map(sc => <option key={sc.id} value={sc.id}>{sc.state}</option>)}
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
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontFamily: theme.fonts.title, fontSize: 40, color: theme.colors.onPrimary, letterSpacing: '0.04em' },
}
