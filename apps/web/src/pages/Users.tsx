import { useEffect, useState } from 'react'
import { deleteUser, getUsers } from '../api/users'
import DataTable, { Column } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
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
  const [data, setData] = useState<User[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState({ name: '', email: '', fidelity_points: 0 })

  useEffect(() => {
    // TODO: handle loading/error states
    getUsers().then(setData)
  }, [])

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
    // TODO: refresh list after delete
    await deleteUser(row.id)
    setData((prev) => prev.filter((u) => u.id !== row.id))
  }

  const handleSubmit = () => {
    // TODO: call createUser / updateUser then refresh list
    setModalOpen(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Utilisateurs</h1>
        <Button onClick={openCreate}>+ Nouveau</Button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} />

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        >
          <Field label="Nom">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Points fidélité">
            <Input
              type="number"
              value={form.fidelity_points}
              onChange={(e) => setForm({ ...form, fidelity_points: Number(e.target.value) })}
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
