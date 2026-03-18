'use client'
import { useState } from 'react'
import { getLab } from '@/lib/data'
import { TOOLS } from '@/lib/tools'
import type { Tool } from '@/lib/types'
import Topbar from '@/components/Topbar'
import LabEntryCard from '@/components/lab/LabEntry'

export default function LabPage() {
  const all = getLab()
  const [filter, setFilter] = useState<Tool | 'all'>('all')
  const filtered = filter === 'all' ? all : all.filter(e => e.tool === filter)
  const tabs = [
    { id: 'all' as const, label: 'All', color: 'var(--text-dim)' },
    ...TOOLS.map(t => ({ id: t.id, label: t.label, color: t.color })),
  ]
  return (
    <>
      <Topbar title="Lab" count={`${filtered.length} experiments`} />
      <div style={{ display: 'flex', background: 'var(--panel)', borderBottom: '1px solid var(--border)', padding: '0 16px', flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding: '9px 14px', border: 'none', background: 'none',
            fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer',
            borderBottom: `2px solid ${filter === t.id ? t.color : 'transparent'}`,
            color: filter === t.id ? t.color : 'var(--text-dim)',
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(e => <LabEntryCard key={e.id} entry={e} />)}
        {filtered.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' as const, paddingTop: 40 }}>
            No experiments yet.
          </div>
        )}
      </div>
    </>
  )
}
