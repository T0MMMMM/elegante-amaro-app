import { useMemo, useState } from 'react'
import { createStateCommand, deleteStateCommand, getStateCommands, updateStateCommand } from '../api/stateCommands'
import { useResource } from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { StateCommand } from '@elegante-amaro-app/shared/types'

type SortKey = 'id' | 'state'

export default function StateCommands() {
  const { data, loading, error, setData } = useResource(getStateCommands)

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
      const cmp = sortKey === 'state' ? a.state.localeCompare(b.state) : a.id - b.id
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  const columns: Column<StateCommand>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 80,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'state', label: 'Statut', width: '40%',
      sortable: true,
      sortDirection: (sortKey === 'state' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('state'),
    },
  ], [sortKey, sortDir])

  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<StateCommand | null>(null)
  const [form, setForm]                   = useState({ state: '' })
  const [saving, setSaving]               = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const openCreate = () => { setEditing(null); setForm({ state: '' }); setModalOpen(true) }
  const openEdit   = (row: StateCommand) => { setEditing(row); setForm({ state: row.state }); setModalOpen(true) }

  const handleConfirmDelete = async () => {
    if (!editing) return
    await deleteStateCommand(editing.id)
    setData(prev => prev.filter(s => s.id !== editing.id))
    setConfirmDeleteOpen(false)
    setModalOpen(false)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateStateCommand(editing.id, form)
        setData(prev => prev.map(s => s.id === updated.id ? updated : s))
      } else {
        const created = await createStateCommand(form)
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
        <h1 style={styles.pageTitle}>Statuts</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} size="half" />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier statut' : 'Nouveau statut'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? () => setConfirmDeleteOpen(true) : undefined}
        >
          <Field label="Statut">
            <Input value={form.state} onChange={e => setForm({ state: e.target.value })} />
          </Field>
        </Modal>
      )}

      {confirmDeleteOpen && editing && (
        <ConfirmDeleteModal
          title="Supprimer le statut"
          message={`Voulez-vous vraiment supprimer le statut "${editing.state}" ? Il ne sera plus proposé pour les commandes. Suppression impossible s'il est encore utilisé dans l'historique.`}
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
