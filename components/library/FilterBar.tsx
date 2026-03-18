'use client'
import { TOOLS } from '@/lib/tools'
import type { Tool } from '@/lib/types'

interface Props {
  active: Tool | 'all'
  onChange: (v: Tool | 'all') => void
}

export default function FilterBar({ active, onChange }: Props) {
  const chip = (id: Tool | 'all', label: string, color?: string) => (
    <button
      key={id}
      onClick={() => onChange(id)}
      style={{
        padding: '2px 9px',
        borderRadius: 3,
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer',
        border: `1px solid ${active === id ? (color ?? 'var(--text-dim)') : 'transparent'}`,
        color: active === id ? (color ?? 'var(--text-dim)') : 'var(--text-dim)',
        background: active === id ? `${color ?? 'var(--panel-hi)'}22` : 'transparent',
        opacity: active === id ? 1 : 0.55,
        transition: 'opacity 0.12s',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      height: 34,
      background: 'var(--panel)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 6,
      flexShrink: 0,
    }}>
      <span style={{
        fontSize: 10.5,
        color: '#555',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.08em',
        marginRight: 4,
      }}>
        Filter
      </span>
      {chip('all', 'All')}
      {TOOLS.map(t => chip(t.id, t.label, t.color))}
    </div>
  )
}
