'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const modules = [
  { href: '/library',     icon: '▤', label: 'Library' },
  { href: '/cheatsheets', icon: '⌘', label: 'Cheat Sheets' },
  { href: '/builder',     icon: '◈', label: 'Builder' },
  { href: '/lab',         icon: '◎', label: 'Lab' },
]

const tools = [
  { label: 'Midjourney', color: 'var(--tag-mj)' },
  { label: 'ComfyUI',    color: 'var(--tag-comfy)' },
  { label: 'Gemini',     color: 'var(--tag-gemini)' },
  { label: 'Freepik',    color: 'var(--tag-fp)' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{ width: 200, background: 'var(--sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em' }}>promptlab</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>ai prompt system</div>
      </div>

      {/* Modules nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        <div style={{ padding: '14px 16px 4px', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Modules</div>
        {modules.map(m => (
          <Link key={m.href} href={m.href} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '7px 16px', textDecoration: 'none',
            fontSize: 12.5, fontWeight: path === m.href ? 500 : 400,
            color: path === m.href ? 'var(--accent)' : 'var(--text-dim)',
            background: path === m.href ? 'rgba(200,169,110,0.12)' : 'transparent',
            borderLeft: `2px solid ${path === m.href ? 'var(--accent)' : 'transparent'}`,
          }}>
            <span style={{ width: 16, textAlign: 'center' }}>{m.icon}</span>
            {m.label}
          </Link>
        ))}

        <div style={{ padding: '14px 16px 4px', marginTop: 8, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Tools</div>
        {tools.map(t => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 16px', fontSize: 12.5, color: 'var(--text-dim)' }}>
            <span style={{ color: t.color, width: 16, textAlign: 'center' }}>●</span>
            {t.label}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 10.5, color: 'var(--text-muted)' }}>
        promptlab v0.1
      </div>
    </aside>
  )
}
