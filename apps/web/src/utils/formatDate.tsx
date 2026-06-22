export function renderDate(value: unknown) {
  if (!value) return '—'
  const d = new Date(String(value))
  return (
    <span title={d.toLocaleString('fr-FR')}>
      {d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
    </span>
  )
}
