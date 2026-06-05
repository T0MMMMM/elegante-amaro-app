import { useState } from 'react'
import { createTable, deleteTable, getTables, updateTable } from '../api/tables'
import { useResource } from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { Table } from '@elegante-amaro-app/shared/types'

const columns: Column<Table>[] = [
  { key: 'id', label: 'ID' },
  { key: 'numero', label: 'Numéro de table' },
]

export default function Tables() {
  const { data, loading, error, setData } = useResource(getTables)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<Table | null>(null)
  const [form, setForm]                   = useState({ numero: 0 })
  const [saving, setSaving]               = useState(false)

  const openCreate = () => { setEditing(null); setForm({ numero: 0 }); setModalOpen(true) }
  const openEdit   = (row: Table) => { setEditing(row); setForm({ numero: row.numero }); setModalOpen(true) }

  const handleDelete = async (row: Table) => {
    if (!confirm(`Supprimer la table #${row.numero} ?`)) return
    await deleteTable(row.id)
    setData(prev => prev.filter(t => t.id !== row.id))
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
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? `Modifier table #${editing.numero}` : 'Nouvelle table'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Numéro">
            <Input type="number" value={form.numero} onChange={e => setForm({ numero: Number(e.target.value) })} />
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
