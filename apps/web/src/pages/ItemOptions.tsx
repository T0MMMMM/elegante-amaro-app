import { useEffect, useState } from 'react'
import { deleteItemOption, getItemOptions } from '../api/itemOptions'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { ItemOption } from '@elegante-amaro-app/shared/types'

const columns: Column<ItemOption>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
  { key: 'extra_price', label: 'Prix supplémentaire', render: (v) => `${Number(v).toFixed(2)} €` },
]

export default function ItemOptions() {
  const [data, setData] = useState<ItemOption[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ItemOption | null>(null)
  const [form, setForm] = useState({ name: '', extra_price: 0 })

  useEffect(() => {
    // TODO: handle loading/error states
    getItemOptions().then(setData)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', extra_price: 0 })
    setModalOpen(true)
  }

  const openEdit = (row: ItemOption) => {
    setEditing(row)
    setForm({ name: row.name, extra_price: row.extra_price })
    setModalOpen(true)
  }

  const handleDelete = async (row: ItemOption) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return
    // TODO: refresh list after delete
    await deleteItemOption(row.id)
    setData((prev) => prev.filter((o) => o.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createItemOption / updateItemOption then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Options</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier option' : 'Nouvelle option'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Prix supplémentaire (€)">
            <Input
              type="number"
              step="0.01"
              value={form.extra_price}
              onChange={(e) => setForm({ ...form, extra_price: Number(e.target.value) })}
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
