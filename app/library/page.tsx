'use client'
import { useState, useMemo } from 'react'
import { getPrompts } from '@/lib/data'
import type { Tool, Prompt } from '@/lib/types'
import Topbar from '@/components/Topbar'
import FilterBar from '@/components/library/FilterBar'
import PromptCard from '@/components/library/PromptCard'
import DetailPanel from '@/components/library/DetailPanel'

export default function LibraryPage() {
  const all = getPrompts()
  const [filter, setFilter] = useState<Tool | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Prompt | null>(null)

  const filtered = useMemo(() => all.filter(p => {
    const matchTool = filter === 'all' || p.tool === filter
    const q = search.toLowerCase()
    const matchSearch = !q
      || p.title.toLowerCase().includes(q)
      || p.prompt.toLowerCase().includes(q)
      || p.tags.some(t => t.includes(q))
      || p.note.toLowerCase().includes(q)
    return matchTool && matchSearch
  }), [all, filter, search])

  return (
    <>
      <Topbar
        title="Library"
        count={`${filtered.length} prompts`}
        search={{ value: search, onChange: setSearch, placeholder: 'search prompts, tags, notes…' }}
        actions={
          <button style={{
            background: 'var(--accent)',
            color: '#1a1400',
            border: 'none',
            borderRadius: 4,
            padding: '5px 12px',
            fontFamily: 'inherit',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            + New
          </button>
        }
      />
      <FilterBar active={filter} onChange={setFilter} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 10,
          alignContent: 'start',
        }}>
          {filtered.map(p => (
            <PromptCard
              key={p.id}
              prompt={p}
              selected={selected?.id === p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{
              color: '#555',
              fontSize: 13,
              gridColumn: '1 / -1',
              paddingTop: 40,
              textAlign: 'center' as const,
            }}>
              No prompts found.
            </div>
          )}
        </div>
        <DetailPanel prompt={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  )
}
