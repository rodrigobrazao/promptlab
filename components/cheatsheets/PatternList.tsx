'use client'
import { useState } from 'react'

interface Pattern {
  title: string
  prompt: string
  note: string
}

export default function PatternList({ patterns }: { patterns: Pattern[] }) {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (i: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 1200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {patterns.map((p, i) => (
        <div key={i} style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
          borderRadius: 5,
          padding: '12px 14px',
        }}>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8, color: 'var(--text)' }}>
            {p.title}
          </div>
          <div className="mono" style={{
            fontSize: 11.5,
            color: 'var(--text-code)',
            background: 'var(--bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 3,
            padding: '7px 9px',
            lineHeight: 1.55,
            marginBottom: 8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {p.prompt}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {p.note && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', flex: 1 }}>
                {p.note}
              </span>
            )}
            <button
              onClick={() => copy(i, p.prompt)}
              style={{
                fontFamily: 'inherit',
                fontSize: 11,
                background: 'var(--panel-hi)',
                border: '1px solid var(--border)',
                borderRadius: 3,
                padding: '3px 10px',
                color: copied === i ? 'var(--accent)' : 'var(--text-dim)',
                cursor: 'pointer',
              }}
            >
              {copied === i ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
