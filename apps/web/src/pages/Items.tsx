import { useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, getItems, updateItem } from '../api/items'
import { getCategories } from '../api/categories'
import { getItemOptions } from '../api/itemOptions'
import { createItemItemOption, deleteItemItemOption, getItemsItemOptions } from '../api/itemsItemOptions'
import { useResource }   from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input, Select } from '../components/ui/Modal'
import MultiSelect from '../components/ui/MultiSelect'
import Button    from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Category, Item, ItemOption, ItemItemOption } from '@elegante-amaro-app/shared/types'

const emptyForm = { name: '', slug: '', price: 0, image: '', category_id: 0 }

const DIACRITICS_RANGE = new RegExp(`[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`, 'g')

const slugify = (value: string) =>
  value
    .normalize('NFD').replace(DIACRITICS_RANGE, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function Items() {
  const { data, loading, error, setData } = useResource(getItems)
  const [categories, setCategories]       = useState<Category[]>([])
  const [itemOptions, setItemOptions]     = useState<ItemOption[]>([])
  const [optionLinks, setOptionLinks]     = useState<ItemItemOption[]>([])

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getItemOptions().then(setItemOptions).catch(() => {})
    getItemsItemOptions().then(setOptionLinks).catch(() => {})
  }, [])

  const columns: Column<Item>[] = useMemo(() => [
    { key: 'id',    label: 'ID' },
    { key: 'name',  label: 'Nom' },
    { key: 'slug',  label: 'Slug' },
    { key: 'price', label: 'Prix', render: v => `${Number(v).toFixed(2)} €` },
    { key: 'category_id', label: 'Catégorie', render: v => categories.find(c => c.id === v)?.name ?? String(v) },
    { key: 'id', label: 'Options', render: (_v, row) => {
        const names = optionLinks
          .filter(l => l.item_id === row.id)
          .map(l => itemOptions.find(o => o.id === l.item_option_id)?.name)
          .filter(Boolean)
        return names.length ? names.join(', ') : '—'
      }
    },
    { key: 'created_at', label: 'Créé le',    render: v => v ? new Date(String(v)).toLocaleString('fr-FR') : '—' },
    { key: 'updated_at', label: 'Modifié le', render: v => v ? new Date(String(v)).toLocaleString('fr-FR') : '—' },
  ], [categories, itemOptions, optionLinks])

  const [modalOpen, setModalOpen]             = useState(false)
  const [editing, setEditing]                 = useState<Item | null>(null)
  const [form, setForm]                       = useState(emptyForm)
  const [slugTouched, setSlugTouched]         = useState(false)
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([])
  const [saving, setSaving]                   = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setSlugTouched(false)
    setSelectedOptionIds([])
    setModalOpen(true)
  }

  const openEdit = (row: Item) => {
    setEditing(row)
    setForm({ name: row.name, slug: row.slug, price: row.price, image: row.image, category_id: row.category_id })
    setSlugTouched(false)
    setSelectedOptionIds(optionLinks.filter(l => l.item_id === row.id).map(l => l.item_option_id))
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

  const syncOptionLinks = async (itemId: number) => {
    const currentLinks = optionLinks.filter(l => l.item_id === itemId)
    const currentIds   = currentLinks.map(l => l.item_option_id)
    const toAdd         = selectedOptionIds.filter(id => !currentIds.includes(id))
    const toRemove      = currentLinks.filter(l => !selectedOptionIds.includes(l.item_option_id))

    await Promise.all([
      ...toAdd.map(item_option_id => createItemItemOption({ item_id: itemId, item_option_id })),
      ...toRemove.map(l => deleteItemItemOption(l.id)),
    ])

    setOptionLinks(await getItemsItemOptions())
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      let item: Item
      if (editing) {
        item = await updateItem(editing.id, form)
        setData(prev => prev.map(i => i.id === item.id ? item : i))
      } else {
        item = await createItem(form)
        setData(prev => [...prev, item])
      }
      await syncOptionLinks(item.id)
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
            <Input
              value={form.name}
              onChange={e => {
                const name = e.target.value
                setForm(f => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }))
              }}
            />
          </Field>
          <Field label="Slug">
            <Input
              value={form.slug}
              onChange={e => {
                setSlugTouched(true)
                setForm(f => ({ ...f, slug: e.target.value }))
              }}
            />
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
          <Field label="Options">
            <MultiSelect
              options={itemOptions.map(o => ({ id: o.id, label: `${o.name} (+${Number(o.extra_price).toFixed(2)} €)` }))}
              selectedIds={selectedOptionIds}
              onChange={setSelectedOptionIds}
              placeholder="— Aucune option —"
            />
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
