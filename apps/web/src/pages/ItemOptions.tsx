import { useState } from 'react'
import { createItemOption, deleteItemOption, getItemOptions, updateItemOption } from '../api/itemOptions'
import { useResource } from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { ItemOption } from '@elegante-amaro-app/shared/types'

const columns: Column<ItemOption>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
  { key: 'extra_price', label: 'Prix supplémentaire', render: v => `${Number(v).toFixed(2)} €` },
]

export default function ItemOptions() {
  const { data, loading, error, setData } = useResource(getItemOptions)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<ItemOption | null>(null)
  const [form, setForm]                   = useState({ name: '', extra_price: 0 })
  const [saving, setSaving]               = useState(false)

  const openCreate = () => { setEditing(null); setForm({ name: '', extra_price: 0 }); setModalOpen(true) }
  const openEdit   = (row: ItemOption) => {
    setEditing(row)
    setForm({ name: row.name, extra_price: row.extra_price })
    setModalOpen(true)
  }

  const handleDelete = async (row: ItemOption) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    await deleteItemOption(row.id)
    setData(prev => prev.filter(o => o.id !== row.id))
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateItemOption(editing.id, form)
        setData(prev => prev.map(o => o.id === updated.id ? updated : o))
      } else {
        const created = await createItemOption(form)
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
        <h1 style={styles.pageTitle}>Options</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier option' : 'Nouvelle option'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Prix supplémentaire (€)">
            <Input type="number" step="0.01" value={form.extra_price} onChange={e => setForm({ ...form, extra_price: Number(e.target.value) })} />
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
