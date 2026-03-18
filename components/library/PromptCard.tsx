'use client'
import type { Prompt } from '@/lib/types'
import { ToolTag, MetaTag } from '@/components/ui/Tag'

interface Props {
  prompt: Prompt
  selected: boolean
  onClick: () => void
}

export default function PromptCard({ prompt: p, selected, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--panel)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderLeft: `3px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 5,
        padding: '13px 14px',
        cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: 'var(--text)' }}>{p.title}</span>
        <ToolTag tool={p.tool} />
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11.5,
          color: 'var(--text-code)',
          background: 'var(--bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 3,
          padding: '7px 9px',
          marginBottom: 9,
          lineHeight: 1.55,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' as const,
        }}
      >
        {p.prompt}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
        {p.tags.map(tag => <MetaTag key={tag} label={tag} />)}
      </div>
      {p.note && (
        <div style={{ fontSize: 11, color: '#777', marginTop: 7, fontStyle: 'italic' }}>
          {p.note}
        </div>
      )}
    </div>
  )
}
