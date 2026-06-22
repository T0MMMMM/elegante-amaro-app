import { useState } from 'react'
import { createUser, deleteUser, updateUser, getUsers } from '../api/users'
import { useResource } from '../hooks/useResource'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { User } from '@elegante-amaro-app/shared/types'

const columns: Column<User>[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'fidelity_points', label: 'Points fidélité' },
  { key: 'roles', label: 'Rôles', render: (v) => (v as string[]).join(', ') },
]

export default function Users() {
  const { data, loading, error, setData } = useResource(getUsers)
  const [modalOpen, setModalOpen]         = useState(false)
  const [editing, setEditing]             = useState<User | null>(null)
  const [form, setForm]                   = useState({ name: '', email: '', fidelity_points: 0 })
  const [saving, setSaving]               = useState(false)

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', email: '', fidelity_points: 0 })
    setModalOpen(true)
  }

  const openEdit = (row: User) => {
    setEditing(row)
    setForm({ name: row.name, email: row.email, fidelity_points: row.fidelity_points })
    setModalOpen(true)
  }

  const handleDelete = async (row: User) => {
    if (!confirm(`Supprimer ${row.name} ?`)) return
    try {
      await deleteUser(row.id)
      setData(prev => prev.filter(u => u.id !== row.id))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression')
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateUser(editing.id, form)
        setData(prev => prev.map(u => u.id === updated.id ? updated : u))
      } else {
        const created = await createUser({ ...form, password_hash: '', roles: [] })
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
        <h1 style={styles.pageTitle}>Utilisateurs</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <PageShell loading={loading} error={error}>
        <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Points fidélité">
            <Input type="number" value={form.fidelity_points} onChange={e => setForm({ ...form, fidelity_points: Number(e.target.value) })} />
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
