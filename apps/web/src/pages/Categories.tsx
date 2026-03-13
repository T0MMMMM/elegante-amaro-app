import { useEffect, useState } from 'react'
import { deleteCategory, getCategories } from '../api/categories'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Category } from '@elegante-amaro-app/shared/types'

const columns: Column<Category>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
]

export default function Categories() {
  const [data, setData] = useState<Category[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '' })

  useEffect(() => {
    // TODO: handle loading/error states
    getCategories().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '' })
    setModalOpen(true)
  }

  const openEdit = (row: Category) => {
    setEditing(row)
    setForm({ name: row.name })
    setModalOpen(true)
  }

  const handleDelete = async (row: Category) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    // TODO: refresh list after delete
    await deleteCategory(row.id)
    setData((prev) => prev.filter((c) => c.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createCategory / updateCategory then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Catégories</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier catégorie' : 'Nouvelle catégorie'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
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
