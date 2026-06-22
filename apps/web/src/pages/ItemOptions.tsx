import { useMemo, useState } from 'react'
import { createItemOption, deleteItemOption, getItemOptions, updateItemOption } from '../api/itemOptions'
import { useResource } from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { ItemOption } from '@elegante-amaro-app/shared/types'

type SortKey = 'id' | 'name' | 'extra_price'

export default function ItemOptions() {
  const { data, loading, error, setData } = useResource(getItemOptions)

  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const sortValue = (row: ItemOption, key: SortKey): number | string =>
    key === 'name' ? row.name : Number(row[key])

  const displayedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const va = sortValue(a, sortKey)
      const vb = sortValue(b, sortKey)
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const columns: Column<ItemOption>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 80,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'name', label: 'Nom', width: '40%',
      sortable: true,
      sortDirection: (sortKey === 'name' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('name'),
    },
    {
      key: 'extra_price', label: 'Prix supplémentaire', width: '30%',
      render: v => `${Number(v).toFixed(2)} €`,
      sortable: true,
      sortDirection: (sortKey === 'extra_price' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('extra_price'),
    },
  ], [sortKey, sortDir])

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

  const handleDelete = async () => {
    if (!editing) return
    if (!confirm(`Supprimer "${editing.name}" ?`)) return
    try {
      await deleteItemOption(editing.id)
      setData(prev => prev.filter(o => o.id !== editing.id))
      setModalOpen(false)
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    }
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
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} size="half" />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier option' : 'Nouvelle option'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? handleDelete : undefined}
          deleteLabel={editing ? `Supprimer "${editing.name}"` : undefined}
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
