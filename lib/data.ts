import type { Prompt, LabEntry, CheatSheet, Tool } from './types'
import promptsData from '@/data/prompts.json'
import labData from '@/data/lab.json'
import mjData from '@/data/cheatsheets/midjourney.json'
import comfyData from '@/data/cheatsheets/comfyui.json'
import geminiData from '@/data/cheatsheets/gemini.json'
import fpData from '@/data/cheatsheets/freepik.json'

export function getPrompts(): Prompt[] { return promptsData as Prompt[] }
export function getLab(): LabEntry[] { return labData as LabEntry[] }
export function getCheatSheet(tool: Tool): CheatSheet {
  const map = { midjourney: mjData, comfyui: comfyData, gemini: geminiData, freepik: fpData }
  return map[tool] as CheatSheet
}
