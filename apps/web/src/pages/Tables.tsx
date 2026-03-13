import { useEffect, useState } from 'react'
import { deleteTable, getTables } from '../api/tables'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Table } from '@elegante-amaro-app/shared/types'

const columns: Column<Table>[] = [
  { key: 'id', label: 'ID' },
  { key: 'numero', label: 'Numéro de table' },
]

export default function Tables() {
  const [data, setData] = useState<Table[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Table | null>(null)
  const [form, setForm] = useState({ numero: 0 })

  useEffect(() => {
    // TODO: handle loading/error states
    getTables().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ numero: 0 })
    setModalOpen(true)
  }

  const openEdit = (row: Table) => {
    setEditing(row)
    setForm({ numero: row.numero })
    setModalOpen(true)
  }

  const handleDelete = async (row: Table) => {
    if (!confirm(`Supprimer la table #${row.numero} ?`)) return
    // TODO: refresh list after delete
    await deleteTable(row.id)
    setData((prev) => prev.filter((t) => t.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createTable / updateTable then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Tables</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? `Modifier table #${editing.numero}` : 'Nouvelle table'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Numéro">
            <Input
              type="number"
              value={form.numero}
              onChange={(e) => setForm({ numero: Number(e.target.value) })}
            />
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
