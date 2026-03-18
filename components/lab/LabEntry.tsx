import type { ReactNode } from 'react'
import type { LabEntry } from '@/lib/types'
import { ToolTag } from '@/components/ui/Tag'
import { StarRating } from '@/components/ui/StarRating'

function LabField({ label, color, children }: { label: string; color: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: '0.06em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{children}</div>
    </div>
  )
}

export default function LabEntryCard({ entry: e }: { entry: LabEntry }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.date}</span>
        <ToolTag tool={e.tool} />
        {e.config && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{e.config}</span>}
        <div style={{ marginLeft: 'auto' }}><StarRating value={e.rating} /></div>
      </div>
      <div className="mono" style={{
        fontSize: 11.5, color: 'var(--text-code)', background: 'var(--bg)',
        border: '1px solid var(--border-subtle)', borderRadius: 3,
        padding: '8px 10px', lineHeight: 1.55, marginBottom: 14, wordBreak: 'break-word',
      }}>
        {e.prompt}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: e.next ? 12 : 0 }}>
        <LabField label="✓ Worked" color="#8ac86e">{e.worked || '—'}</LabField>
        <LabField label="✗ Failed" color="#c86e8a">{e.failed || '—'}</LabField>
      </div>
      {e.next && <LabField label="→ Next" color="var(--accent)">{e.next}</LabField>}
    </div>
  )
}
