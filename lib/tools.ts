import type { Tool } from './types'

export const TOOLS: { id: Tool; label: string; short: string; color: string }[] = [
  { id: 'midjourney', label: 'Midjourney', short: 'MJ',  color: '#6e9ec8' },
  { id: 'comfyui',    label: 'ComfyUI',    short: 'CUI', color: '#8ac86e' },
  { id: 'gemini',     label: 'Gemini',     short: 'GEM', color: '#c86e8a' },
  { id: 'freepik',    label: 'Freepik',    short: 'FP',  color: '#9b6ec8' },
]

export function getTool(id: Tool) {
  return TOOLS.find(t => t.id === id)!
}
