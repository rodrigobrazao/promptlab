'use client'
import { useState } from 'react'
import type { CheatParam } from '@/lib/types'

export default function ParamTable({ params }: { params: CheatParam[] }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (example: string) => {
    navigator.clipboard.writeText(example)
    setCopied(example)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Parameter', 'Type', 'Description', 'Example', 'Default'].map(h => (
            <th key={h} style={{
              textAlign: 'left' as const,
              padding: '6px 10px',
              fontSize: 10,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              fontWeight: 600,
            }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {params.map(p => (
          <tr key={p.name} style={{ borderBottom: '1px solid #353535' }}>
            <td style={{ padding: '7px 10px' }}>
              <code style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>
                {p.name}
              </code>
            </td>
            <td style={{ padding: '7px 10px', color: 'var(--text-muted)', fontSize: 11 }}>
              {p.type}
            </td>
            <td style={{ padding: '7px 10px', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              {p.description}
            </td>
            <td style={{ padding: '7px 10px' }}>
              <button
                onClick={() => copy(p.example)}
                disabled={!p.example}
                style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  background: 'var(--bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 3,
                  padding: '2px 8px',
                  color: copied === p.example ? 'var(--accent)' : 'var(--text-code)',
                  cursor: p.example ? 'pointer' : 'default',
                }}
              >
                {copied === p.example ? '✓' : (p.example || '—')}
              </button>
            </td>
            <td style={{ padding: '7px 10px', color: 'var(--text-muted)', fontSize: 11 }}>
              {p.default ?? '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
