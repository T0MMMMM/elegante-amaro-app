import { useState } from 'react'
import { createStateCommand, deleteStateCommand, getStateCommands, updateStateCommand } from '../api/stateCommands'
import { useResource } from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { StateCommand } from '@elegante-amaro-app/shared/types'

const columns: Column<StateCommand>[] = [
  { key: 'id', label: 'ID' },
  { key: 'state', label: 'Statut' },
]

export default function StateCommands() {
  const { data, loading, error, setData } = useResource(getStateCommands)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<StateCommand | null>(null)
  const [form, setForm]                   = useState({ state: '' })
  const [saving, setSaving]               = useState(false)

  const openCreate = () => { setEditing(null); setForm({ state: '' }); setModalOpen(true) }
  const openEdit   = (row: StateCommand) => { setEditing(row); setForm({ state: row.state }); setModalOpen(true) }

  const handleDelete = async (row: StateCommand) => {
    if (!confirm(`Supprimer le statut "${row.state}" ?`)) return
    await deleteStateCommand(row.id)
    setData(prev => prev.filter(s => s.id !== row.id))
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
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier statut' : 'Nouveau statut'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Statut">
            <Input value={form.state} onChange={e => setForm({ state: e.target.value })} />
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
