import { useEffect, useState } from 'react'
import { deleteItem, getItems } from '../api/items'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Item } from '@elegante-amaro-app/shared/types'

const columns: Column<Item>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
  { key: 'slug', label: 'Slug' },
  { key: 'price', label: 'Prix', render: (v) => `${Number(v).toFixed(2)} €` },
  { key: 'category_id', label: 'Catégorie' },
]

export default function Items() {
  const [data, setData] = useState<Item[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', price: 0, image: '', category_id: 0 })

  useEffect(() => {
    // TODO: handle loading/error states
    getItems().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', slug: '', price: 0, image: '', category_id: 0 })
    setModalOpen(true)
  }

  const openEdit = (row: Item) => {
    setEditing(row)
    setForm({ name: row.name, slug: row.slug, price: row.price, image: row.image, category_id: row.category_id })
    setModalOpen(true)
  }

  const handleDelete = async (row: Item) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    // TODO: refresh list after delete
    await deleteItem(row.id)
    setData((prev) => prev.filter((i) => i.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createItem / updateItem then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Articles</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier article' : 'Nouvel article'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Slug">
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Prix (€)">
            <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </Field>
          <Field label="Image URL">
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </Field>
          <Field label="ID Catégorie">
            <Input type="number" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: Number(e.target.value) })} />
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
