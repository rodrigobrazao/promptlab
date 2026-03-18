interface TopbarProps {
  title: string
  count?: string
  actions?: React.ReactNode
  search?: { value: string; onChange: (v: string) => void; placeholder?: string }
}

export default function Topbar({ title, count, actions, search }: TopbarProps) {
  return (
    <div style={{ height: 40, background: 'var(--panel)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
      {count && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{count}</span>}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {search && (
          <input
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? 'search…'}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 12, width: 200, outline: 'none' }}
          />
        )}
        {actions}
      </div>
    </div>
  )
}
