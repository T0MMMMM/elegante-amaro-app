import { useEffect, useState } from 'react'
import { deleteStateCommand, getStateCommands } from '../api/stateCommands'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { StateCommand } from '@elegante-amaro-app/shared/types'

const columns: Column<StateCommand>[] = [
  { key: 'id', label: 'ID' },
  { key: 'state', label: 'Statut' },
]

export default function StateCommands() {
  const [data, setData] = useState<StateCommand[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<StateCommand | null>(null)
  const [form, setForm] = useState({ state: '' })

  useEffect(() => {
    // TODO: handle loading/error states
    getStateCommands().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ state: '' })
    setModalOpen(true)
  }

  const openEdit = (row: StateCommand) => {
    setEditing(row)
    setForm({ state: row.state })
    setModalOpen(true)
  }

  const handleDelete = async (row: StateCommand) => {
    if (!confirm(`Supprimer le statut "${row.state}" ?`)) return
    // TODO: refresh list after delete
    await deleteStateCommand(row.id)
    setData((prev) => prev.filter((s) => s.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createStateCommand / updateStateCommand then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Statuts</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier statut' : 'Nouveau statut'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Statut">
            <Input value={form.state} onChange={(e) => setForm({ state: e.target.value })} />
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
