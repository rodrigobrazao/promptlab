'use client'
import { useState } from 'react'
import { TOOLS } from '@/lib/tools'
import { getCheatSheet } from '@/lib/data'
import type { Tool } from '@/lib/types'
import Topbar from '@/components/Topbar'
import ParamTable from '@/components/cheatsheets/ParamTable'
import PatternList from '@/components/cheatsheets/PatternList'

export default function CheatSheetsPage() {
  const [active, setActive] = useState<Tool>('midjourney')
  const sheet = getCheatSheet(active)
  const activeTool = TOOLS.find(t => t.id === active)!

  return (
    <>
      <Topbar title="Cheat Sheets" />
      <div style={{
        display: 'flex',
        background: 'var(--panel)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: '9px 16px', border: 'none', background: 'none',
            fontFamily: 'inherit', fontSize: 12.5, cursor: 'pointer',
            borderBottom: `2px solid ${active === t.id ? t.color : 'transparent'}`,
            color: active === t.id ? t.color : 'var(--text-dim)',
            fontWeight: active === t.id ? 500 : 400,
          }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {sheet.sections.map(sec => (
          <section key={sec.title} style={{ marginBottom: 32 }}>
            <h2 style={{
              fontSize: 11, textTransform: 'uppercase' as const,
              letterSpacing: '0.1em', color: activeTool.color,
              fontWeight: 600, margin: '0 0 12px 0',
            }}>
              {sec.title}
            </h2>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
              <ParamTable params={sec.params} />
            </div>
          </section>
        ))}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{
            fontSize: 11, textTransform: 'uppercase' as const,
            letterSpacing: '0.1em', color: activeTool.color,
            fontWeight: 600, margin: '0 0 12px 0',
          }}>
            Prompt Patterns
          </h2>
          <PatternList patterns={sheet.patterns} />
        </section>
      </div>
    </>
  )
}
