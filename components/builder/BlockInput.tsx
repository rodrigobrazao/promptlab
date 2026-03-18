interface Props {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  hint?: string
}

export default function BlockInput({ label, placeholder, value, onChange, hint }: Props) {
  return (
    <div>
      <div style={{
        fontSize: 10, textTransform: 'uppercase' as const,
        letterSpacing: '0.1em', color: 'var(--text-muted)',
        fontWeight: 600, marginBottom: 5,
      }}>
        {label}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--bg)',
          border: '1px solid var(--border)', borderRadius: 4,
          padding: '7px 10px', color: 'var(--text)',
          fontFamily: 'inherit', fontSize: 12.5, outline: 'none',
        }}
      />
      {hint && (
        <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
          {hint}
        </div>
      )}
    </div>
  )
}
