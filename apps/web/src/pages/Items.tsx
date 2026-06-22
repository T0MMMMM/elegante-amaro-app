import { useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, getItems, updateItem } from '../api/items'
import { getCategories } from '../api/categories'
import { useResource }   from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input, Select } from '../components/ui/Modal'
import Button    from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Category, Item } from '@elegante-amaro-app/shared/types'

const emptyForm = { name: '', slug: '', price: 0, image: '', category_id: 0 }

export default function Items() {
  const { data, loading, error, setData } = useResource(getItems)
  const [categories, setCategories]       = useState<Category[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const columns: Column<Item>[] = useMemo(() => [
    { key: 'id',    label: 'ID' },
    { key: 'name',  label: 'Nom' },
    { key: 'slug',  label: 'Slug' },
    { key: 'price', label: 'Prix', render: v => `${Number(v).toFixed(2)} €` },
    { key: 'category_id', label: 'Catégorie', render: v => categories.find(c => c.id === v)?.name ?? String(v) },
  ], [categories])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Item | null>(null)
  const [form, setForm]           = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit   = (row: Item) => {
    setEditing(row)
    setForm({ name: row.name, slug: row.slug, price: row.price, image: row.image, category_id: row.category_id })
    setModalOpen(true)
  }

  const handleDelete = async (row: Item) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    try {
      await deleteItem(row.id)
      setData(prev => prev.filter(i => i.id !== row.id))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateItem(editing.id, form)
        setData(prev => prev.map(i => i.id === updated.id ? updated : i))
      } else {
        const created = await createItem(form)
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
        <h1 style={styles.pageTitle}>Articles</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier article' : 'Nouvel article'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Slug">
            <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          </Field>
          <Field label="Prix (€)">
            <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          </Field>
          <Field label="Image URL">
            <Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          </Field>
          <Field label="Catégorie">
            <Select value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}>
              <option value={0}>— Choisir une catégorie —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
