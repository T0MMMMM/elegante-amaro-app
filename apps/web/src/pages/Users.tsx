import { useMemo, useState } from 'react'
import { createUser, deleteUser, updateUser, getUsers } from '../api/users'
import { useResource } from '../hooks/useResource'
import DataTable, { Column, SortDirection } from '../components/ui/DataTable'
import Modal, { Field, Input } from '../components/ui/Modal'
import Button from '../components/ui/Button'
import PageShell from '../components/ui/PageShell'
import { theme } from '@elegante-amaro-app/shared/constants'
import type { User } from '@elegante-amaro-app/shared/types'

type SortKey = 'id' | 'name' | 'fidelity_points'

export default function Users() {
  const { data, loading, error, setData } = useResource(getUsers)

  const [roleFilter, setRoleFilter] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) { setSortKey(key); setSortDir('asc'); return }
    if (sortDir === 'asc') { setSortDir('desc'); return }
    setSortKey(null)
  }

  const sortValue = (row: User, key: SortKey): number | string => {
    switch (key) {
      case 'id':              return row.id
      case 'name':            return row.name
      case 'fidelity_points': return row.fidelity_points
    }
  }

  const displayedData = useMemo(() => {
    let rows = data
    if (roleFilter.length) rows = rows.filter(u => u.roles.some(r => roleFilter.includes(r)))

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = sortValue(a, sortKey)
        const vb = sortValue(b, sortKey)
        const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return rows
  }, [data, roleFilter, sortKey, sortDir])

  const roleOptions = useMemo(
    () => Array.from(new Set(data.flatMap(u => u.roles))).sort(),
    [data]
  )

  const columns: Column<User>[] = useMemo(() => [
    {
      key: 'id', label: 'ID', width: 50,
      sortable: true,
      sortDirection: (sortKey === 'id' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('id'),
    },
    {
      key: 'name', label: 'Nom', width: '22%',
      sortable: true,
      sortDirection: (sortKey === 'name' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('name'),
    },
    { key: 'email', label: 'Email', width: '28%' },
    {
      key: 'fidelity_points', label: 'Points fidélité', width: '16%',
      sortable: true,
      sortDirection: (sortKey === 'fidelity_points' ? sortDir : null) as SortDirection,
      onSortClick: () => toggleSort('fidelity_points'),
    },
    {
      key: 'roles', label: 'Rôles', width: '20%',
      render: (v) => (v as string[]).join(', '),
      filter: {
        options: roleOptions.map(r => ({ value: r, label: r })),
        selected: roleFilter,
        onChange: values => setRoleFilter(values as string[]),
      },
    },
  ], [roleOptions, roleFilter, sortKey, sortDir])

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

  const handleDelete = async () => {
    if (!editing) return
    if (!confirm(`Supprimer ${editing.name} ?`)) return
    try {
      await deleteUser(editing.id)
      setData(prev => prev.filter(u => u.id !== editing.id))
      setModalOpen(false)
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
        <DataTable columns={columns} data={displayedData} onEdit={openEdit} />
      </PageShell>

      {modalOpen && (
        <Modal
          title={editing ? 'Modifier utilisateur' : 'Nouvel utilisateur'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitting={saving}
          onDelete={editing ? handleDelete : undefined}
          deleteLabel={editing ? `Supprimer ${editing.name}` : undefined}
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
