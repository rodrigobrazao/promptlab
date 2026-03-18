export function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < value ? 'var(--accent)' : '#444', fontSize: 14 }}>
          ★
        </span>
      ))}
    </div>
  )
}
