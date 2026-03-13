import { useEffect, useState } from 'react'
import { deleteCommand, getCommands } from '../api/commands'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Command } from '@elegante-amaro-app/shared/types'

const columns: Column<Command>[] = [
  { key: 'id', label: 'ID' },
  { key: 'user_id', label: 'Utilisateur' },
  { key: 'table_id', label: 'Table' },
  { key: 'state_command_id', label: 'Statut' },
  { key: 'type_id', label: 'Type' },
  { key: 'total_price', label: 'Total', render: (v) => `${Number(v).toFixed(2)} €` },
  { key: 'created_at', label: 'Créée le', render: (v) => new Date(String(v)).toLocaleDateString('fr-FR') },
]

export default function Commands() {
  const [data, setData] = useState<Command[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Command | null>(null)
  const [form, setForm] = useState({ user_id: 0, table_id: 0, type_id: 0, state_command_id: 0, tva_rate: 20 })

  useEffect(() => {
    // TODO: handle loading/error states
    getCommands().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ user_id: 0, table_id: 0, type_id: 0, state_command_id: 0, tva_rate: 20 })
    setModalOpen(true)
  }

  const openEdit = (row: Command) => {
    setEditing(row)
    setForm({ user_id: row.user_id, table_id: row.table_id, type_id: row.type_id, state_command_id: row.state_command_id, tva_rate: row.tva_rate })
    setModalOpen(true)
  }

  const handleDelete = async (row: Command) => {
    if (!confirm(`Supprimer la commande #${row.id} ?`)) return
    // TODO: refresh list after delete
    await deleteCommand(row.id)
    setData((prev) => prev.filter((c) => c.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createCommand / updateCommand then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Commandes</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? `Modifier commande #${editing.id}` : 'Nouvelle commande'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="ID Utilisateur">
            <Input type="number" value={form.user_id} onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} />
          </Field>
          <Field label="ID Table">
            <Input type="number" value={form.table_id} onChange={(e) => setForm({ ...form, table_id: Number(e.target.value) })} />
          </Field>
          <Field label="ID Type">
            <Input type="number" value={form.type_id} onChange={(e) => setForm({ ...form, type_id: Number(e.target.value) })} />
          </Field>
          <Field label="ID Statut">
            <Input type="number" value={form.state_command_id} onChange={(e) => setForm({ ...form, state_command_id: Number(e.target.value) })} />
          </Field>
          <Field label="TVA (%)">
            <Input type="number" step="0.01" value={form.tva_rate} onChange={(e) => setForm({ ...form, tva_rate: Number(e.target.value) })} />
          </Field>
        </Modal>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontFamily: theme.fonts.body, fontSize: 32, fontWeight: 700, color: theme.colors.onPrimary },
}
