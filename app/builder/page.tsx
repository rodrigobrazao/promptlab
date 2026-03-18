'use client'
import { useState } from 'react'
import { TOOLS } from '@/lib/tools'
import type { Tool } from '@/lib/types'
import Topbar from '@/components/Topbar'
import BlockInput from '@/components/builder/BlockInput'

const TOOL_PARAMS: Record<Tool, { label: string; placeholder: string }[]> = {
  midjourney: [
    { label: '--ar',      placeholder: '16:9' },
    { label: '--v',       placeholder: '6' },
    { label: '--stylize', placeholder: '100-1000' },
    { label: '--chaos',   placeholder: '0-100' },
    { label: '--no',      placeholder: 'text, watermark…' },
  ],
  comfyui: [
    { label: 'steps',     placeholder: '20' },
    { label: 'cfg_scale', placeholder: '7' },
    { label: 'sampler',   placeholder: 'dpmpp_2m' },
    { label: 'negative',  placeholder: 'blurry, low quality…' },
  ],
  gemini: [
    { label: 'temperature', placeholder: '0.7' },
    { label: 'style',       placeholder: 'respond as JSON…' },
  ],
  freepik: [
    { label: 'style',        placeholder: 'photo, digital-art…' },
    { label: 'aspect_ratio', placeholder: '16:9' },
    { label: 'lighting',     placeholder: 'dramatic, studio…' },
  ],
}

export default function BuilderPage() {
  const [tool, setTool]         = useState<Tool>('midjourney')
  const [subject, setSubject]   = useState('')
  const [style, setStyle]       = useState('')
  const [lighting, setLighting] = useState('')
  const [mood, setMood]         = useState('')
  const [params, setParams]     = useState<Record<string, string>>({})
  const [copied, setCopied]     = useState(false)

  const toolDef    = TOOLS.find(t => t.id === tool)!
  const toolParams = TOOL_PARAMS[tool]

  const setParam = (k: string, v: string) =>
    setParams(prev => ({ ...prev, [k]: v }))

  const buildPrompt = (): string => {
    const parts = [subject, style, lighting, mood].filter(Boolean)
    const base  = parts.join(', ')
    if (!base) return ''
    if (tool === 'midjourney') {
      const paramStr = toolParams
        .filter(p => params[p.label])
        .map(p => `${p.label} ${params[p.label]}`)
        .join(' ')
      return paramStr ? `${base} ${paramStr}` : base
    }
    return base
  }

  const prompt = buildPrompt()

  const copy = () => {
    if (!prompt) return
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <Topbar title="Builder" />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: blocks */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Tool selector */}
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
              Target Tool
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {TOOLS.map(t => (
                <button key={t.id} onClick={() => { setTool(t.id); setParams({}) }} style={{
                  padding: '5px 14px',
                  border: `1px solid ${tool === t.id ? t.color : 'var(--border)'}`,
                  borderRadius: 4,
                  background: tool === t.id ? `${t.color}20` : 'transparent',
                  color: tool === t.id ? t.color : 'var(--text-dim)',
                  fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
                  fontWeight: tool === t.id ? 500 : 400,
                }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <BlockInput label="Subject" placeholder="what or who — e.g. 'brutalist architecture', 'particle field'" value={subject} onChange={setSubject} hint="The main element of your image" />
          <BlockInput label="Style"   placeholder="e.g. 'Tadao Ando influence', 'glitch art', 'photorealistic'" value={style}   onChange={setStyle}   hint="Visual references, movements, artists" />
          <BlockInput label="Lighting" placeholder="e.g. 'volumetric light', 'neon glow', 'golden hour'" value={lighting} onChange={setLighting} />
          <BlockInput label="Mood / Atmosphere" placeholder="e.g. 'cinematic', 'eerie', 'minimal', 'dramatic'" value={mood} onChange={setMood} />

          {/* Tool params */}
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10 }}>
              {toolDef.label} Parameters
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {toolParams.map(p => (
                <BlockInput key={p.label} label={p.label} placeholder={p.placeholder} value={params[p.label] ?? ''} onChange={v => setParam(p.label, v)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ width: 340, background: '#242424', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>
              Generated Prompt
            </div>
            <span style={{
              fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 2,
              color: toolDef.color, background: `${toolDef.color}26`,
              letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            }}>
              {toolDef.label}
            </span>
          </div>
          <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
            <div className="mono" style={{
              fontSize: 12, color: prompt ? 'var(--text)' : 'var(--text-muted)',
              background: 'var(--bg)', border: '1px solid var(--border-subtle)',
              borderRadius: 3, padding: '10px 12px', lineHeight: 1.65,
              minHeight: 120, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {prompt || 'Fill in the blocks to build your prompt…'}
            </div>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <button onClick={copy} disabled={!prompt} style={{
              width: '100%', background: 'var(--panel-hi)', border: '1px solid var(--border)',
              borderRadius: 4, color: copied ? 'var(--accent)' : 'var(--text)',
              fontFamily: 'inherit', fontSize: 12, padding: 8,
              cursor: prompt ? 'pointer' : 'not-allowed',
              fontWeight: 500, opacity: prompt ? 1 : 0.4, transition: 'color 0.15s',
            }}>
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
