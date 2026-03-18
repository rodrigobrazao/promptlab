'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Prompt } from '@/lib/types'
import { ToolTag, MetaTag } from '@/components/ui/Tag'
import { StarRating } from '@/components/ui/StarRating'

interface Props {
  prompt: Prompt | null
  onClose: () => void
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 10,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        color: '#666',
        marginBottom: 5,
        fontWeight: 600,
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

export default function DetailPanel({ prompt: p, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  if (!p) {
    return (
      <div style={{
        width: 300,
        background: '#242424',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ color: '#555', fontSize: 12 }}>Select a prompt</span>
      </div>
    )
  }

  const copy = () => {
    navigator.clipboard.writeText(p.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      width: 300,
      background: '#242424',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        <ToolTag tool={p.tool} />
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: 'var(--text)' }}>{p.title}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: 18,
            cursor: 'pointer',
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div style={{
        padding: '14px 16px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <Field label="Prompt">
          <div className="mono" style={{
            fontSize: 12,
            color: 'var(--text-code)',
            background: 'var(--bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 3,
            padding: '8px 10px',
            lineHeight: 1.6,
            wordBreak: 'break-word',
          }}>
            {p.prompt}
          </div>
        </Field>

        {Object.keys(p.params).length > 0 && (
          <Field label="Parameters">
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
              {Object.entries(p.params).map(([k, v]) => (
                <span key={k} style={{
                  fontSize: 11,
                  background: 'var(--bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 3,
                  padding: '2px 8px',
                  color: 'var(--text-code)',
                  fontFamily: 'monospace',
                }}>
                  --{k} <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{v}</span>
                </span>
              ))}
            </div>
          </Field>
        )}

        <Field label="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5 }}>
            {p.tags.map(t => <MetaTag key={t} label={t} />)}
          </div>
        </Field>

        <Field label="Rating">
          <StarRating value={p.rating} />
        </Field>

        {p.note && (
          <Field label="Notes">
            <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{p.note}</div>
          </Field>
        )}

        <Field label="Created">
          <div style={{ fontSize: 11, color: '#666' }}>{p.createdAt}</div>
        </Field>
      </div>

      {/* Copy button */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={copy}
          style={{
            width: '100%',
            background: 'var(--panel-hi)',
            border: '1px solid var(--border)',
            borderRadius: 4,
            color: copied ? 'var(--accent)' : 'var(--text)',
            fontFamily: 'inherit',
            fontSize: 12,
            padding: 8,
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'color 0.15s',
          }}
        >
          {copied ? '✓ Copied!' : '⎘ Copy prompt'}
        </button>
      </div>
    </div>
  )
}
