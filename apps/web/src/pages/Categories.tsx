import { useState } from 'react'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../api/categories'
import { useResource } from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Category } from '@elegante-amaro-app/shared/types'

const columns: Column<Category>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
]

export default function Categories() {
  const { data, loading, error, setData } = useResource(getCategories)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<Category | null>(null)
  const [form, setForm]                   = useState({ name: '' })
  const [saving, setSaving]               = useState(false)

  const openCreate = () => { setEditing(null); setForm({ name: '' }); setModalOpen(true) }
  const openEdit   = (row: Category) => { setEditing(row); setForm({ name: row.name }); setModalOpen(true) }

  const handleDelete = async (row: Category) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    await deleteCategory(row.id)
    setData(prev => prev.filter(c => c.id !== row.id))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, form)
        setData(prev => prev.map(c => c.id === updated.id ? updated : c))
      } else {
        const created = await createCategory(form)
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
        <h1 style={styles.pageTitle}>Catégories</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier catégorie' : 'Nouvelle catégorie'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={e => setForm({ name: e.target.value })} />
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
