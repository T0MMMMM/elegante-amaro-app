import { useMemo, useState } from 'react'
import { createTable, deleteTable, getTables, updateTable } from '../api/tables'
import { useResource } from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Table } from '@elegante-amaro-app/shared/types'

type SortKey = 'id' | 'numero'

export default function Tables() {
  const { data, loading, error, setData } = useResource(getTables)

  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const displayedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const cmp = a[sortKey] - b[sortKey]
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const columns: Column<Table>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 80,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'numero', label: 'Numéro de table', width: '40%',
      sortable: true,
      sortDirection: (sortKey === 'numero' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('numero'),
    },
  ], [sortKey, sortDir])

  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<Table | null>(null)
  const [form, setForm]                   = useState({ numero: 0 })
  const [saving, setSaving]               = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const openCreate = () => { setEditing(null); setForm({ numero: 0 }); setModalOpen(true) }
  const openEdit   = (row: Table) => { setEditing(row); setForm({ numero: row.numero }); setModalOpen(true) }

  const handleConfirmDelete = async () => {
    if (!editing) return
    await deleteTable(editing.id)
    setData(prev => prev.filter(t => t.id !== editing.id))
    setConfirmDeleteOpen(false)
    setModalOpen(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateTable(editing.id, form)
        setData(prev => prev.map(t => t.id === updated.id ? updated : t))
      } else {
        const created = await createTable(form)
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
        <h1 style={styles.pageTitle}>Tables</h1>
        <Button onClick={openCreate}>+ Nouvelle</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} size="half" />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? `Modifier table #${editing.numero}` : 'Nouvelle table'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? () => setConfirmDeleteOpen(true) : undefined}
        >
          <Field label="Numéro">
            <Input type="number" value={form.numero} onChange={e => setForm({ numero: Number(e.target.value) })} />
          </Field>
        </Modal>
      )}

      {confirmDeleteOpen && editing && (
        <ConfirmDeleteModal
          title="Supprimer la table"
          message={`Voulez-vous vraiment supprimer la table #${editing.numero} ?`}
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
