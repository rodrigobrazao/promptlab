export type Tool = 'midjourney' | 'comfyui' | 'gemini' | 'freepik'

export interface Prompt {
  id: string
  title: string
  tool: Tool
  prompt: string
  params: Record<string, string>
  tags: string[]
  rating: number
  note: string
  createdAt: string
}

export interface LabEntry {
  id: string
  date: string
  promptId: string | null
  tool: Tool
  prompt: string
  config: string
  image: string | null
  worked: string
  failed: string
  next: string
  rating: number
}

export interface CheatParam {
  name: string
  type: string
  description: string
  example: string
  default?: string
}

export interface CheatSection {
  title: string
  params: CheatParam[]
}

export interface CheatSheet {
  tool: Tool
  sections: CheatSection[]
  patterns: { title: string; prompt: string; note: string }[]
}
