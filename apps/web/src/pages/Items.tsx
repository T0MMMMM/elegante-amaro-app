import { useEffect, useMemo, useState } from 'react'
import { createItem, deleteItem, getItems, updateItem } from '../api/items'
import { getCategories } from '../api/categories'
import { getItemOptions } from '../api/itemOptions'
import { createItemItemOption, deleteItemItemOption, getItemsItemOptions } from '../api/itemsItemOptions'
import { useResource }   from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input, Select } from '../components/ui/Modal'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'
import MultiSelect from '../components/ui/MultiSelect'
import Button    from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { renderDate } from '../utils/formatDate'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Category, Item, ItemOption, ItemItemOption } from '@elegante-amaro-app/shared/types'

const emptyForm = { name: '', slug: '', price: 0, image: '', category_id: 0 }

type SortKey = 'id' | 'name' | 'price' | 'created_at' | 'updated_at'

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

  const [categoryFilter, setCategoryFilter] = useState<number[]>([])
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const sortValue = (row: Item, key: SortKey): number | string => {
    switch (key) {
      case 'id':         return row.id
      case 'name':       return row.name
      case 'price':      return Number(row.price)
      case 'created_at': return new Date(row.created_at).getTime()
      case 'updated_at': return new Date(row.updated_at).getTime()
    }
  }

  const displayedData = useMemo(() => {
    let rows = data
    if (categoryFilter.length) rows = rows.filter(i => categoryFilter.includes(i.category_id))

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = sortValue(a, sortKey)
        const vb = sortValue(b, sortKey)
        const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [data, categoryFilter, sortKey, sortDir])

  const columns: Column<Item>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 50,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'name', label: 'Nom', width: '20%',
      sortable: true,
      sortDirection: (sortKey === 'name' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('name'),
    },
    { key: 'slug', label: 'Slug', width: '16%' },
    {
      key: 'price', label: 'Prix', width: 90,
      render: v => `${Number(v).toFixed(2)} €`,
      sortable: true,
      sortDirection: (sortKey === 'price' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('price'),
    },
    {
      key: 'category_id', label: 'Catégorie', width: '14%',
      render: v => categories.find(c => c.id === v)?.name ?? String(v),
      filter: {
        options: categories.map(c => ({ value: c.id, label: c.name })),
        selected: categoryFilter,
        onChange: values => setCategoryFilter(values as number[]),
      },
    },
    { key: 'id', label: 'Options', width: '20%', render: (_v, row) => {
        const names = optionLinks
          .filter(l => l.item_id === row.id)
          .map(l => itemOptions.find(o => o.id === l.item_option_id)?.name)
          .filter(Boolean)
        return names.length ? names.join(', ') : '—'
      }
    },
    {
      key: 'created_at', label: 'Créé le', width: 90,
      render: renderDate,
      sortable: true,
      sortDirection: (sortKey === 'created_at' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('created_at'),
    },
    {
      key: 'updated_at', label: 'Modifié le', width: 90,
      render: renderDate,
      sortable: true,
      sortDirection: (sortKey === 'updated_at' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('updated_at'),
    },
  ], [categories, itemOptions, optionLinks, categoryFilter, sortKey, sortDir])

  const [modalOpen, setModalOpen]             = useState(false)
  const [editing, setEditing]                 = useState<Item | null>(null)
  const [form, setForm]                       = useState(emptyForm)
  const [slugTouched, setSlugTouched]         = useState(false)
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([])
  const [saving, setSaving]                   = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

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

  const handleConfirmDelete = async () => {
    if (!editing) return
    await deleteItem(editing.id)
    setData(prev => prev.filter(i => i.id !== editing.id))
    setConfirmDeleteOpen(false)
    setModalOpen(false)
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
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier article' : 'Nouvel article'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? () => setConfirmDeleteOpen(true) : undefined}
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

      {confirmDeleteOpen && editing && (
        <ConfirmDeleteModal
          title="Supprimer l'article"
          message={`Voulez-vous vraiment supprimer l'article "${editing.name}" ?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteOpen(false)}
        />
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  pageTitle: { fontFamily: theme.fonts.title, fontSize: 40, color: theme.colors.onPrimary, letterSpacing: '0.04em' },
}
