import { getTool } from '@/lib/tools'
import type { Tool } from '@/lib/types'

export function ToolTag({ tool }: { tool: Tool }) {
  const t = getTool(tool)
  return (
    <span style={{
      fontSize: 9.5,
      fontWeight: 600,
      padding: '2px 6px',
      borderRadius: 2,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      color: t.color,
      background: `${t.color}26`,
    }}>
      {t.short}
    </span>
  )
}

export function MetaTag({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 10,
      color: '#666',
      background: 'var(--bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 2,
      padding: '1px 6px',
    }}>
      {label}
    </span>
  )
}
