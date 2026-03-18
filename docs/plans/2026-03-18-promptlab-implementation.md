# promptlab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal Next.js web app for managing AI prompts, learning cheat sheets, a block-based prompt builder, and a lab diary — styled after Nuke (The Foundry) with Source Sans 3.

**Architecture:** Static Next.js 14 app (App Router), no backend, data stored as JSON files in the repo. Each module is a route (`/library`, `/cheatsheets`, `/builder`, `/lab`). All state is client-side; no auth, no database.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Source Sans 3 (Google Fonts), local JSON data files, Vercel (deploy)

---

## Design Reference

- Preview mockup: `../../PROMPTS/promptlab-preview.html` (open in browser to see the target aesthetic)
- Design doc: `docs/plans/2026-03-18-promptlab-design.md`

### Colour tokens (use these exact values everywhere)
```
--bg:         #272727
--panel:      #2f2f2f
--panel-hi:   #383838
--border:     #404040
--text:       #d8d4cc
--text-dim:   #888888
--accent:     #c8a96e
--tag-mj:     #6e9ec8
--tag-comfy:  #8ac86e
--tag-gemini: #c86e8a
--tag-fp:     #9b6ec8
```

---

## Task 1: Git Init + Project Bootstrap

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `.gitignore`

**Step 1: Initialise git**
```bash
cd "/Users/rbmacbookpro/Library/Mobile Documents/com~apple~CloudDocs/00_WORK/11_AI/promptlab"
git init
```

**Step 2: Bootstrap Next.js project**
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-eslint
```
Answer prompts: accept all defaults.

**Step 3: Install Google Fonts via next/font**
No extra install needed — Next.js handles Google Fonts natively.

**Step 4: Clean default files**
Delete: `app/page.tsx` content, `app/globals.css` content (we rewrite both).
Delete: `public/next.svg`, `public/vercel.svg`.

**Step 5: Verify project runs**
```bash
npm run dev
```
Expected: `http://localhost:3000` loads (default Next.js page is fine for now).

**Step 6: Commit**
```bash
git add .
git commit -m "chore: bootstrap Next.js 14 + Tailwind project"
```

---

## Task 2: Global Styles + Layout Shell

**Files:**
- Modify: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `components/Sidebar.tsx`
- Create: `components/Topbar.tsx`

**Step 1: Write `app/globals.css`**
```css
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600&family=Source+Code+Pro:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #272727;
  --panel: #2f2f2f;
  --panel-hi: #383838;
  --border: #404040;
  --text: #d8d4cc;
  --text-dim: #888888;
  --accent: #c8a96e;
  --tag-mj: #6e9ec8;
  --tag-comfy: #8ac86e;
  --tag-gemini: #c86e8a;
  --tag-fp: #9b6ec8;
}

* { box-sizing: border-box; }
body {
  font-family: 'Source Sans 3', sans-serif;
  background: var(--bg);
  color: var(--text);
  overflow: hidden;
  height: 100vh;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

/* Monospace for prompts */
.mono { font-family: 'Source Code Pro', monospace; }
```

**Step 2: Write `tailwind.config.ts`**
```ts
import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:         '#272727',
        panel:      '#2f2f2f',
        'panel-hi': '#383838',
        border:     '#404040',
        text:       '#d8d4cc',
        dim:        '#888888',
        accent:     '#c8a96e',
        mj:         '#6e9ec8',
        comfy:      '#8ac86e',
        gemini:     '#c86e8a',
        fp:         '#9b6ec8',
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
    },
  },
} satisfies Config
```

**Step 3: Write `components/Sidebar.tsx`**
```tsx
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
    <aside style={{ width: 200, background: '#232323', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em' }}>promptlab</div>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>ai prompt system</div>
      </div>

      {/* Modules nav */}
      <nav style={{ padding: '10px 0', flex: 1 }}>
        <div style={{ padding: '14px 16px 4px', fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 600 }}>Modules</div>
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

        <div style={{ padding: '14px 16px 4px', marginTop: 8, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 600 }}>Tools</div>
        {tools.map(t => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 16px', fontSize: 12.5, color: 'var(--text-dim)' }}>
            <span style={{ color: t.color, width: 16, textAlign: 'center' }}>●</span>
            {t.label}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 10.5, color: '#555' }}>
        promptlab v0.1
      </div>
    </aside>
  )
}
```

**Step 4: Write `components/Topbar.tsx`**
```tsx
interface TopbarProps {
  title: string
  count?: string
  actions?: React.ReactNode
  search?: { value: string; onChange: (v: string) => void; placeholder?: string }
}

export default function Topbar({ title, count, actions, search }: TopbarProps) {
  return (
    <div style={{ height: 40, background: 'var(--panel)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
      {count && <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{count}</span>}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {search && (
          <input
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
            placeholder={search.placeholder ?? 'search…'}
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 12, width: 200, outline: 'none' }}
          />
        )}
        {actions}
      </div>
    </div>
  )
}
```

**Step 5: Write `app/layout.tsx`**
```tsx
import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = { title: 'promptlab', description: 'personal AI prompt system' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
```

**Step 6: Write `app/page.tsx`** (redirect to library)
```tsx
import { redirect } from 'next/navigation'
export default function Home() { redirect('/library') }
```

**Step 7: Verify layout**
```bash
npm run dev
```
Expected: `localhost:3000` shows sidebar + redirects to `/library` (404 page is fine — module not built yet).

**Step 8: Commit**
```bash
git add .
git commit -m "feat: global styles + sidebar + topbar shell"
```

---

## Task 3: Data Layer — Types + JSON Files

**Files:**
- Create: `lib/types.ts`
- Create: `data/prompts.json`
- Create: `data/lab.json`
- Create: `data/cheatsheets/midjourney.json`
- Create: `data/cheatsheets/comfyui.json`
- Create: `data/cheatsheets/gemini.json`
- Create: `data/cheatsheets/freepik.json`
- Create: `lib/data.ts`

**Step 1: Write `lib/types.ts`**
```ts
export type Tool = 'midjourney' | 'comfyui' | 'gemini' | 'freepik'

export interface Prompt {
  id: string
  title: string
  tool: Tool
  prompt: string
  params: Record<string, string>
  tags: string[]
  rating: number        // 1–5
  note: string
  createdAt: string     // ISO date
}

export interface LabEntry {
  id: string
  date: string
  promptId: string | null
  tool: Tool
  prompt: string
  config: string
  image: string | null  // path relative to /public
  worked: string
  failed: string
  next: string
  rating: number
}

export interface CheatParam {
  name: string
  type: string          // e.g. "integer", "ratio", "flag"
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
```

**Step 2: Write `data/prompts.json`** (seed data — 6 prompts)
```json
[
  {
    "id": "p1",
    "title": "Volumetric Light — Fog Layer",
    "tool": "midjourney",
    "prompt": "god rays through dense fog, volumetric light shafts, cinematic --ar 16:9 --v 6 --stylize 750",
    "params": { "ar": "16:9", "v": "6", "stylize": "750" },
    "tags": ["lighting", "atmosphere", "generative"],
    "rating": 4,
    "note": "Funciona bem com cenas de instalação. Combinar com Deforum para loops.",
    "createdAt": "2026-03-18"
  },
  {
    "id": "p2",
    "title": "SDXL Noise Texture — Organic",
    "tool": "comfyui",
    "prompt": "organic cellular noise, voronoi pattern, microscopic texture, 4k seamless tile, neutral palette",
    "params": { "steps": "30", "cfg": "7", "sampler": "dpmpp_2m" },
    "tags": ["texture", "seamless", "generative"],
    "rating": 5,
    "note": "Usar como base no TouchDesigner — pipe para TOP.",
    "createdAt": "2026-03-18"
  },
  {
    "id": "p3",
    "title": "Abstract Geometry — Brutalist",
    "tool": "gemini",
    "prompt": "brutalist concrete structure, angular geometry, dramatic shadow, overcast sky, Tadao Ando influence, photorealistic",
    "params": { "temperature": "0.7" },
    "tags": ["architecture", "reference"],
    "rating": 3,
    "note": "",
    "createdAt": "2026-03-18"
  },
  {
    "id": "p4",
    "title": "Particle Field — Dark Matter",
    "tool": "freepik",
    "prompt": "quantum particle field, dark matter visualization, bioluminescent traces, deep space, long exposure effect, ultra-detailed",
    "params": {},
    "tags": ["generative", "particles", "space"],
    "rating": 4,
    "note": "",
    "createdAt": "2026-03-18"
  },
  {
    "id": "p5",
    "title": "LiDAR Point Cloud Viz",
    "tool": "midjourney",
    "prompt": "LiDAR point cloud visualization, sparse data topology, wireframe depth map, technical aesthetic, neon on black --ar 16:9 --v 6",
    "params": { "ar": "16:9", "v": "6" },
    "tags": ["data-viz", "lidar", "installation"],
    "rating": 5,
    "note": "Referência para instalação com Raspberry + LiDAR.",
    "createdAt": "2026-03-18"
  },
  {
    "id": "p6",
    "title": "Motion Blur — Kinetic Form",
    "tool": "comfyui",
    "prompt": "fluid motion blur, kinetic sculpture in motion, long exposure, minimal background, studio light",
    "params": { "steps": "25", "cfg": "6.5" },
    "tags": ["motion", "sculpture"],
    "rating": 3,
    "note": "",
    "createdAt": "2026-03-18"
  }
]
```

**Step 3: Write `data/lab.json`** (seed data — 2 entries)
```json
[
  {
    "id": "l1",
    "date": "2026-03-18",
    "promptId": "p1",
    "tool": "midjourney",
    "prompt": "god rays through dense fog, volumetric light shafts, cinematic --ar 16:9 --v 6 --stylize 750",
    "config": "v6, stylize 750",
    "image": null,
    "worked": "A luz volumétrica ficou muito convincente e dramática",
    "failed": "O foreground ficou muito vazio, precisa de elementos",
    "next": "Adicionar elementos de foreground, tentar --chaos 15",
    "rating": 4
  },
  {
    "id": "l2",
    "date": "2026-03-17",
    "promptId": null,
    "tool": "comfyui",
    "prompt": "cellular automata growth pattern, organic expansion",
    "config": "SDXL, 30 steps, DPM++ 2M",
    "image": null,
    "worked": "Padrão orgânico convincente, boa para uso em touchdesigner",
    "failed": "Resolução baixa para projection mapping",
    "next": "Aumentar para 2048x2048, testar upscaler",
    "rating": 3
  }
]
```

**Step 4: Write `data/cheatsheets/midjourney.json`**
```json
{
  "tool": "midjourney",
  "sections": [
    {
      "title": "Core Parameters",
      "params": [
        { "name": "--v", "type": "integer", "description": "Versão do modelo (5.2, 6, 6.1)", "example": "--v 6", "default": "6" },
        { "name": "--ar", "type": "ratio", "description": "Aspect ratio da imagem", "example": "--ar 16:9", "default": "1:1" },
        { "name": "--stylize", "type": "integer 0–1000", "description": "Força do estilo artístico MJ. Maior = mais interpretativo", "example": "--stylize 750", "default": "100" },
        { "name": "--chaos", "type": "integer 0–100", "description": "Variação aleatória nas gerações. Maior = mais imprevisível", "example": "--chaos 20", "default": "0" },
        { "name": "--quality", "type": "0.25 | 0.5 | 1", "description": "Tempo de renderização / detalhe", "example": "--quality 1", "default": "1" },
        { "name": "--seed", "type": "integer", "description": "Seed para reprodutibilidade", "example": "--seed 12345" },
        { "name": "--no", "type": "text", "description": "Negative prompt — o que excluir", "example": "--no text, watermark" },
        { "name": "--tile", "type": "flag", "description": "Gera padrão tileable (seamless)", "example": "--tile" },
        { "name": "--iw", "type": "0–3", "description": "Image weight — peso de imagem de referência", "example": "--iw 1.5", "default": "1" },
        { "name": "--cref", "type": "url", "description": "Character reference — mantém consistência de personagem", "example": "--cref https://..." }
      ]
    },
    {
      "title": "Style Suffixes",
      "params": [
        { "name": "::weight", "type": "float", "description": "Multi-prompt weight. ex: forest::2 castle::1", "example": "forest::2 castle::1" },
        { "name": "--style raw", "type": "flag", "description": "Menos opinionated, mais fotorealista em v6", "example": "--style raw" }
      ]
    }
  ],
  "patterns": [
    { "title": "Fotorealismo técnico", "prompt": "[sujeito], photorealistic, shot on Sony A7R, 85mm, f/1.8, natural light --ar 3:2 --v 6 --style raw", "note": "Remover --style raw para look mais pictórico" },
    { "title": "Arte generativa / glitch", "prompt": "[sujeito], glitch art, datamoshing, pixel sorting, corrupted data aesthetic --ar 1:1 --v 6 --stylize 900 --chaos 30", "note": "Aumentar chaos para resultados mais imprevisíveis" },
    { "title": "Instalação / projecção", "prompt": "[sujeito], projection mapping reference, dark background, high contrast, architectural surface --ar 16:9 --v 6 --stylize 600", "note": "Usar como referência visual para mapeamento" }
  ]
}
```

**Step 5: Write `data/cheatsheets/comfyui.json`**
```json
{
  "tool": "comfyui",
  "sections": [
    {
      "title": "KSampler — Parâmetros Principais",
      "params": [
        { "name": "steps", "type": "integer", "description": "Número de passos de diffusion. Mais = mais detalhe (mas mais lento)", "example": "30", "default": "20" },
        { "name": "cfg_scale", "type": "float 1–20", "description": "Classifier Free Guidance — quão próximo o resultado fica do prompt. Maior = mais fiel mas menos criativo", "example": "7", "default": "7" },
        { "name": "sampler_name", "type": "string", "description": "Algoritmo de sampling", "example": "dpmpp_2m", "default": "euler" },
        { "name": "scheduler", "type": "string", "description": "Schedule de noise", "example": "karras", "default": "normal" },
        { "name": "denoise", "type": "0–1", "description": "Para img2img — quanto da imagem original se preserva (1 = ignora original)", "example": "0.75", "default": "1" },
        { "name": "seed", "type": "integer", "description": "Seed de aleatoriedade. -1 = aleatório", "example": "42", "default": "-1" }
      ]
    },
    {
      "title": "Samplers Recomendados",
      "params": [
        { "name": "dpmpp_2m + karras", "type": "combo", "description": "Excelente qualidade/velocidade. O mais usado.", "example": "20–30 steps" },
        { "name": "euler_a", "type": "sampler", "description": "Mais criativo/variado. Bom para exploração.", "example": "25–40 steps" },
        { "name": "dpmpp_3m_sde + karras", "type": "combo", "description": "Alta qualidade, mais lento. Para resultados finais.", "example": "30–40 steps" }
      ]
    },
    {
      "title": "Nodes Essenciais",
      "params": [
        { "name": "CheckpointLoaderSimple", "type": "node", "description": "Carrega o modelo base (checkpoint .safetensors)", "example": "SDXL, SD1.5, Flux" },
        { "name": "CLIPTextEncode", "type": "node", "description": "Converte texto em embeddings. Um para positive, um para negative prompt", "example": "" },
        { "name": "KSampler", "type": "node", "description": "O nó central — executa o processo de diffusion", "example": "" },
        { "name": "VAEDecode", "type": "node", "description": "Converte latent space em imagem final", "example": "" },
        { "name": "LoraLoader", "type": "node", "description": "Carrega LoRA para fine-tuning de estilo/personagem", "example": "strength: 0.6–1.0" },
        { "name": "ImageScale", "type": "node", "description": "Redimensiona imagem. Usar antes de hires fix", "example": "" }
      ]
    }
  ],
  "patterns": [
    { "title": "Workflow base txt2img", "prompt": "CheckpointLoader → CLIPTextEncode (pos+neg) → EmptyLatentImage → KSampler → VAEDecode → SaveImage", "note": "Workflow mínimo funcional. Ponto de partida." },
    { "title": "Hires fix (upscale)", "prompt": "...KSampler → VAEDecode → ImageScale (2x) → VAEEncode → KSampler (denoise 0.5) → VAEDecode → SaveImage", "note": "Segunda passagem com denoise baixo melhora detalhe sem mudar composição" }
  ]
}
```

**Step 6: Write `data/cheatsheets/gemini.json`**
```json
{
  "tool": "gemini",
  "sections": [
    {
      "title": "Parâmetros de Geração",
      "params": [
        { "name": "temperature", "type": "float 0–2", "description": "Criatividade/aleatoriedade. 0 = determinístico, 2 = muito criativo", "example": "0.7", "default": "1.0" },
        { "name": "top_p", "type": "float 0–1", "description": "Nucleus sampling. Controla diversidade do vocabulário", "example": "0.9", "default": "0.95" },
        { "name": "top_k", "type": "integer", "description": "Limita o pool de tokens considerados", "example": "40", "default": "64" },
        { "name": "max_output_tokens", "type": "integer", "description": "Máximo de tokens na resposta", "example": "2048" }
      ]
    },
    {
      "title": "Prompting Patterns",
      "params": [
        { "name": "System instruction", "type": "pattern", "description": "Define papel e contexto antes do prompt", "example": "You are a visual concept generator for generative art installations. Respond with vivid, technical descriptions." },
        { "name": "Few-shot", "type": "pattern", "description": "Dá exemplos de input→output antes do pedido real", "example": "Input: fog + electronics → Output: circuit boards dissolving into morning mist..." },
        { "name": "Multimodal", "type": "pattern", "description": "Envia imagem + texto. Pede análise ou variações", "example": "Analisa esta imagem e gera 5 variações de prompt para Midjourney no mesmo estilo" }
      ]
    }
  ],
  "patterns": [
    { "title": "Gerador de prompts MJ a partir de conceito", "prompt": "You are an expert Midjourney prompt engineer. Convert this concept into 3 different Midjourney prompts with --v 6 parameters:\n\nConcept: [descreve aqui]", "note": "Útil para traduzir ideias abstractas em prompts concretos" },
    { "title": "Análise de estética visual", "prompt": "Analyse this image and describe: 1) lighting setup 2) colour palette (hex codes) 3) compositional technique 4) mood keywords. Format as JSON.", "note": "Usar com imagem de referência para reverse-engineer o estilo" }
  ]
}
```

**Step 7: Write `data/cheatsheets/freepik.json`**
```json
{
  "tool": "freepik",
  "sections": [
    {
      "title": "Parâmetros Principais",
      "params": [
        { "name": "aspect_ratio", "type": "ratio", "description": "Proporção da imagem gerada", "example": "16:9, 1:1, 4:3, 9:16" },
        { "name": "style", "type": "string", "description": "Preset de estilo visual", "example": "photo, digital-art, illustration, 3d" },
        { "name": "color", "type": "string", "description": "Direcção de cor dominante", "example": "neutral, warm, cool, vibrant" },
        { "name": "lighting", "type": "string", "description": "Tipo de iluminação", "example": "studio, dramatic, soft, neon, golden-hour" }
      ]
    }
  ],
  "patterns": [
    { "title": "Textura seamless", "prompt": "[material] texture, seamless pattern, top-down view, no shadows, neutral background, high detail, 4k", "note": "Funciona bem para uso em TouchDesigner ou Three.js" },
    { "title": "Concept art instalação", "prompt": "immersive art installation, [tema], large scale, dramatic lighting, dark environment, visitors silhouettes for scale, architectural photography", "note": "Referência visual para propostas de projectos" }
  ]
}
```

**Step 8: Write `lib/data.ts`** (data access helpers)
```ts
import prompts from '@/data/prompts.json'
import lab from '@/data/lab.json'
import mj from '@/data/cheatsheets/midjourney.json'
import comfy from '@/data/cheatsheets/comfyui.json'
import gemini from '@/data/cheatsheets/gemini.json'
import fp from '@/data/cheatsheets/freepik.json'
import type { Prompt, LabEntry, CheatSheet, Tool } from './types'

export function getPrompts(): Prompt[] { return prompts as Prompt[] }
export function getLab(): LabEntry[] { return lab as LabEntry[] }
export function getCheatSheet(tool: Tool): CheatSheet {
  const map = { midjourney: mj, comfyui: comfy, gemini, freepik: fp }
  return map[tool] as CheatSheet
}
```

**Step 9: Add resolveJsonModule to tsconfig**
In `tsconfig.json`, ensure:
```json
"resolveJsonModule": true
```

**Step 10: Commit**
```bash
git add .
git commit -m "feat: types, seed data, cheat sheet content"
```

---

## Task 4: Library Module

**Files:**
- Create: `app/library/page.tsx`
- Create: `components/library/PromptCard.tsx`
- Create: `components/library/DetailPanel.tsx`
- Create: `components/library/FilterBar.tsx`
- Create: `components/ui/Tag.tsx`
- Create: `components/ui/StarRating.tsx`
- Create: `lib/tools.ts`

**Step 1: Write `lib/tools.ts`**
```ts
import type { Tool } from './types'

export const TOOLS: { id: Tool; label: string; short: string; color: string }[] = [
  { id: 'midjourney', label: 'Midjourney', short: 'MJ',  color: '#6e9ec8' },
  { id: 'comfyui',    label: 'ComfyUI',    short: 'CUI', color: '#8ac86e' },
  { id: 'gemini',     label: 'Gemini',     short: 'GEM', color: '#c86e8a' },
  { id: 'freepik',    label: 'Freepik',    short: 'FP',  color: '#9b6ec8' },
]

export function getTool(id: Tool) { return TOOLS.find(t => t.id === id)! }
```

**Step 2: Write `components/ui/Tag.tsx`**
```tsx
import { getTool } from '@/lib/tools'
import type { Tool } from '@/lib/types'

export function ToolTag({ tool }: { tool: Tool }) {
  const t = getTool(tool)
  return (
    <span style={{
      fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 2,
      letterSpacing: '0.06em', textTransform: 'uppercase' as const,
      color: t.color, background: `${t.color}26`,
    }}>{t.short}</span>
  )
}

export function MetaTag({ label }: { label: string }) {
  return (
    <span style={{ fontSize: 10, color: '#666', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 2, padding: '1px 6px' }}>
      {label}
    </span>
  )
}
```

**Step 3: Write `components/ui/StarRating.tsx`**
```tsx
export function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < value ? 'var(--accent)' : '#444', fontSize: 14 }}>★</span>
      ))}
    </div>
  )
}
```

**Step 4: Write `components/library/PromptCard.tsx`**
```tsx
'use client'
import type { Prompt } from '@/lib/types'
import { ToolTag, MetaTag } from '@/components/ui/Tag'

interface Props { prompt: Prompt; selected: boolean; onClick: () => void }

export default function PromptCard({ prompt: p, selected, onClick }: Props) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--panel)', border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      borderLeft: `2px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 5, padding: '13px 14px', cursor: 'pointer',
      transition: 'border-color 0.12s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{p.title}</span>
        <ToolTag tool={p.tool} />
      </div>
      <div className="mono" style={{ fontSize: 11.5, color: '#aaa', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '7px 9px', marginBottom: 9, lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
        {p.prompt}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
        {p.tags.map(tag => <MetaTag key={tag} label={tag} />)}
      </div>
      {p.note && <div style={{ fontSize: 11, color: '#777', marginTop: 7, fontStyle: 'italic' }}>{p.note}</div>}
    </div>
  )
}
```

**Step 5: Write `components/library/DetailPanel.tsx`**
```tsx
'use client'
import { useState } from 'react'
import type { Prompt } from '@/lib/types'
import { ToolTag, MetaTag } from '@/components/ui/Tag'
import { StarRating } from '@/components/ui/StarRating'

interface Props { prompt: Prompt | null; onClose: () => void }

export default function DetailPanel({ prompt: p, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  if (!p) return (
    <div style={{ width: 300, background: '#242424', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#555', fontSize: 12 }}>Select a prompt</span>
    </div>
  )

  const copy = () => {
    navigator.clipboard.writeText(p.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{ width: 300, background: '#242424', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <ToolTag tool={p.tool} />
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{p.title}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Prompt">
          <div className="mono" style={{ fontSize: 12, color: '#aaa', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '8px 10px', lineHeight: 1.6 }}>
            {p.prompt}
          </div>
        </Field>

        {Object.keys(p.params).length > 0 && (
          <Field label="Parameters">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {Object.entries(p.params).map(([k, v]) => (
                <span key={k} style={{ fontSize: 11, background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '2px 8px', color: '#aaa' }}>
                  --{k} <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{v}</span>
                </span>
              ))}
            </div>
          </Field>
        )}

        <Field label="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {p.tags.map(t => <MetaTag key={t} label={t} />)}
          </div>
        </Field>

        <Field label="Rating"><StarRating value={p.rating} /></Field>

        {p.note && <Field label="Notes"><div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{p.note}</div></Field>}

        <Field label="Created"><div style={{ fontSize: 11, color: '#666' }}>{p.createdAt}</div></Field>
      </div>

      {/* Copy button */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button onClick={copy} style={{ width: '100%', background: 'var(--panel-hi)', border: '1px solid var(--border)', borderRadius: 4, color: copied ? 'var(--accent)' : 'var(--text)', fontFamily: 'inherit', fontSize: 12, padding: 8, cursor: 'pointer', fontWeight: 500, transition: 'color 0.15s' }}>
          {copied ? '✓ Copied!' : '⎘ Copy prompt'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', marginBottom: 5, fontWeight: 600 }}>{label}</div>
      {children}
    </div>
  )
}
```

**Step 6: Write `components/library/FilterBar.tsx`**
```tsx
'use client'
import { TOOLS } from '@/lib/tools'
import type { Tool } from '@/lib/types'

interface Props { active: Tool | 'all'; onChange: (v: Tool | 'all') => void }

export default function FilterBar({ active, onChange }: Props) {
  const chip = (id: Tool | 'all', label: string, color?: string) => (
    <button key={id} onClick={() => onChange(id)} style={{
      padding: '2px 9px', borderRadius: 3, fontSize: 11, fontWeight: 500, cursor: 'pointer',
      border: `1px solid ${active === id ? (color ?? 'var(--border)') : 'transparent'}`,
      color: active === id ? (color ?? 'var(--text-dim)') : 'var(--text-dim)',
      background: active === id ? `${color ?? 'var(--panel-hi)'}22` : 'transparent',
      opacity: active === id ? 1 : 0.55, transition: 'opacity 0.12s',
      fontFamily: 'inherit',
    }}>{label}</button>
  )
  return (
    <div style={{ height: 34, background: 'var(--panel)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6, flexShrink: 0 }}>
      <span style={{ fontSize: 10.5, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Filter</span>
      {chip('all', 'All')}
      {TOOLS.map(t => chip(t.id, t.label, t.color))}
    </div>
  )
}
```

**Step 7: Write `app/library/page.tsx`**
```tsx
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
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.note.toLowerCase().includes(q)
    return matchTool && matchSearch
  }), [all, filter, search])

  return (
    <>
      <Topbar
        title="Library"
        count={`${filtered.length} prompts`}
        search={{ value: search, onChange: setSearch, placeholder: 'search prompts, tags, notes…' }}
        actions={<button style={{ background: 'var(--accent)', color: '#1a1400', border: 'none', borderRadius: 4, padding: '5px 12px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ New</button>}
      />
      <FilterBar active={filter} onChange={setFilter} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10, alignContent: 'start' }}>
          {filtered.map(p => (
            <PromptCard key={p.id} prompt={p} selected={selected?.id === p.id} onClick={() => setSelected(selected?.id === p.id ? null : p)} />
          ))}
          {filtered.length === 0 && <div style={{ color: '#555', fontSize: 13, gridColumn: '1/-1', paddingTop: 40, textAlign: 'center' }}>No prompts found.</div>}
        </div>
        <DetailPanel prompt={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  )
}
```

**Step 8: Verify Library**
```bash
npm run dev
```
Navigate to `localhost:3000/library`. Expected: grid of 6 prompt cards, filter bar, detail panel opens on click, copy button works.

**Step 9: Commit**
```bash
git add .
git commit -m "feat: library module — cards, filters, detail panel"
```

---

## Task 5: Cheat Sheets Module

**Files:**
- Create: `app/cheatsheets/page.tsx`
- Create: `components/cheatsheets/ParamTable.tsx`
- Create: `components/cheatsheets/PatternList.tsx`

**Step 1: Write `components/cheatsheets/ParamTable.tsx`**
```tsx
'use client'
import { useState } from 'react'
import type { CheatParam } from '@/lib/types'

export default function ParamTable({ params }: { params: CheatParam[] }) {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = (example: string) => {
    navigator.clipboard.writeText(example)
    setCopied(example)
    setTimeout(() => setCopied(null), 1200)
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {['Parameter', 'Type', 'Description', 'Example', 'Default'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {params.map(p => (
          <tr key={p.name} style={{ borderBottom: '1px solid #353535' }}>
            <td style={{ padding: '7px 10px' }}><code style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>{p.name}</code></td>
            <td style={{ padding: '7px 10px', color: '#777', fontSize: 11 }}>{p.type}</td>
            <td style={{ padding: '7px 10px', color: 'var(--text-dim)', lineHeight: 1.5 }}>{p.description}</td>
            <td style={{ padding: '7px 10px' }}>
              <button onClick={() => copy(p.example)} style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '2px 8px', color: copied === p.example ? 'var(--accent)' : '#aaa', cursor: 'pointer' }}>
                {copied === p.example ? '✓' : p.example}
              </button>
            </td>
            <td style={{ padding: '7px 10px', color: '#666', fontSize: 11 }}>{p.default ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

**Step 2: Write `components/cheatsheets/PatternList.tsx`**
```tsx
'use client'
import { useState } from 'react'

interface Pattern { title: string; prompt: string; note: string }

export default function PatternList({ patterns }: { patterns: Pattern[] }) {
  const [copied, setCopied] = useState<number | null>(null)
  const copy = (i: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(i)
    setTimeout(() => setCopied(null), 1200)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {patterns.map((p, i) => (
        <div key={i} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, padding: '12px 14px' }}>
          <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 8 }}>{p.title}</div>
          <div className="mono" style={{ fontSize: 11.5, color: '#aaa', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '7px 9px', lineHeight: 1.55, marginBottom: 8 }}>
            {p.prompt}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {p.note && <span style={{ fontSize: 11, color: '#777', fontStyle: 'italic', flex: 1 }}>{p.note}</span>}
            <button onClick={() => copy(i, p.prompt)} style={{ fontFamily: 'inherit', fontSize: 11, background: 'var(--panel-hi)', border: '1px solid var(--border)', borderRadius: 3, padding: '3px 10px', color: copied === i ? 'var(--accent)' : 'var(--text-dim)', cursor: 'pointer' }}>
              {copied === i ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Step 3: Write `app/cheatsheets/page.tsx`**
```tsx
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

  return (
    <>
      <Topbar title="Cheat Sheets" />
      {/* Tool tabs */}
      <div style={{ display: 'flex', background: 'var(--panel)', borderBottom: '1px solid var(--border)', padding: '0 16px', flexShrink: 0 }}>
        {TOOLS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: '9px 16px', border: 'none', background: 'none', fontFamily: 'inherit',
            fontSize: 12.5, cursor: 'pointer', borderBottom: `2px solid ${active === t.id ? t.color : 'transparent'}`,
            color: active === t.id ? t.color : 'var(--text-dim)', fontWeight: active === t.id ? 500 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {sheet.sections.map(sec => (
          <section key={sec.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 12 }}>{sec.title}</h2>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
              <ParamTable params={sec.params} />
            </div>
          </section>
        ))}

        <section>
          <h2 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 12 }}>Prompt Patterns</h2>
          <PatternList patterns={sheet.patterns} />
        </section>
      </div>
    </>
  )
}
```

**Step 4: Verify Cheat Sheets**
Navigate to `localhost:3000/cheatsheets`. Expected: tabs for each tool, param tables with copy-on-click examples, pattern cards at bottom.

**Step 5: Commit**
```bash
git add .
git commit -m "feat: cheat sheets module with param tables and patterns"
```

---

## Task 6: Builder Module

**Files:**
- Create: `app/builder/page.tsx`
- Create: `components/builder/BlockInput.tsx`

**Step 1: Write `components/builder/BlockInput.tsx`**
```tsx
interface Props { label: string; placeholder: string; value: string; onChange: (v: string) => void; hint?: string }

export default function BlockInput({ label, placeholder, value, onChange, hint }: Props) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 5 }}>{label}</div>
      <input
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, padding: '7px 10px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 12.5, outline: 'none' }}
      />
      {hint && <div style={{ fontSize: 10.5, color: '#555', marginTop: 4, fontStyle: 'italic' }}>{hint}</div>}
    </div>
  )
}
```

**Step 2: Write `app/builder/page.tsx`**
```tsx
'use client'
import { useState } from 'react'
import { TOOLS } from '@/lib/tools'
import type { Tool } from '@/lib/types'
import Topbar from '@/components/Topbar'
import BlockInput from '@/components/builder/BlockInput'

const TOOL_PARAMS: Record<Tool, { label: string; placeholder: string }[]> = {
  midjourney: [
    { label: '--ar', placeholder: '16:9' },
    { label: '--v', placeholder: '6' },
    { label: '--stylize', placeholder: '100–1000' },
    { label: '--chaos', placeholder: '0–100' },
    { label: '--no', placeholder: 'text, watermark…' },
  ],
  comfyui: [
    { label: 'steps', placeholder: '20' },
    { label: 'cfg_scale', placeholder: '7' },
    { label: 'sampler', placeholder: 'dpmpp_2m' },
    { label: 'negative', placeholder: 'blurry, low quality…' },
  ],
  gemini: [
    { label: 'temperature', placeholder: '0.7' },
    { label: 'style', placeholder: 'respond as JSON…' },
  ],
  freepik: [
    { label: 'style', placeholder: 'photo, digital-art…' },
    { label: 'aspect_ratio', placeholder: '16:9' },
    { label: 'lighting', placeholder: 'dramatic, studio…' },
  ],
}

export default function BuilderPage() {
  const [tool, setTool] = useState<Tool>('midjourney')
  const [subject, setSubject] = useState('')
  const [style, setStyle] = useState('')
  const [lighting, setLighting] = useState('')
  const [mood, setMood] = useState('')
  const [params, setParams] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)

  const toolDef = TOOLS.find(t => t.id === tool)!
  const toolParams = TOOL_PARAMS[tool]

  const setParam = (k: string, v: string) => setParams(prev => ({ ...prev, [k]: v }))

  const buildPrompt = () => {
    const parts = [subject, style, lighting, mood].filter(Boolean)
    const paramStr = toolParams
      .map(p => params[p.label] ? (tool === 'midjourney' ? ` ${p.label} ${params[p.label]}` : '') : '')
      .join('')
    const negativeParam = tool === 'comfyui' ? '' : ''
    return parts.join(', ') + (tool === 'midjourney' ? paramStr : '')
  }

  const prompt = buildPrompt()

  const copy = () => {
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
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 8 }}>Target Tool</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {TOOLS.map(t => (
                <button key={t.id} onClick={() => { setTool(t.id); setParams({}) }} style={{
                  padding: '5px 14px', border: `1px solid ${tool === t.id ? t.color : 'var(--border)'}`,
                  borderRadius: 4, background: tool === t.id ? `${t.color}20` : 'transparent',
                  color: tool === t.id ? t.color : 'var(--text-dim)', fontFamily: 'inherit',
                  fontSize: 12, cursor: 'pointer', fontWeight: tool === t.id ? 500 : 400,
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          <BlockInput label="Subject" placeholder="what or who — e.g. 'brutalist architecture', 'particle field'" value={subject} onChange={setSubject} hint="The main element of your image" />
          <BlockInput label="Style" placeholder="e.g. 'Tadao Ando influence', 'glitch art', 'photorealistic'" value={style} onChange={setStyle} hint="Visual references, movements, artists" />
          <BlockInput label="Lighting" placeholder="e.g. 'volumetric light', 'neon glow', 'golden hour', 'overcast'" value={lighting} onChange={setLighting} />
          <BlockInput label="Mood / Atmosphere" placeholder="e.g. 'cinematic', 'eerie', 'minimal', 'dramatic'" value={mood} onChange={setMood} />

          {/* Tool-specific params */}
          <div>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 10 }}>
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
        <div style={{ width: 340, background: '#242424', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600, marginBottom: 8 }}>Generated Prompt</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 2, color: toolDef.color, background: `${toolDef.color}26`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{toolDef.id}</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: 16 }}>
            <div className="mono" style={{ fontSize: 12, color: prompt ? 'var(--text)' : '#555', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '10px 12px', lineHeight: 1.65, minHeight: 120, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {prompt || 'Fill in the blocks to build your prompt…'}
            </div>
          </div>
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <button onClick={copy} disabled={!prompt} style={{ flex: 1, background: 'var(--panel-hi)', border: '1px solid var(--border)', borderRadius: 4, color: copied ? 'var(--accent)' : 'var(--text)', fontFamily: 'inherit', fontSize: 12, padding: 8, cursor: prompt ? 'pointer' : 'not-allowed', fontWeight: 500, opacity: prompt ? 1 : 0.4 }}>
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
```

**Step 3: Verify Builder**
Navigate to `localhost:3000/builder`. Expected: block inputs update the prompt preview in real time, tool selector changes available params.

**Step 4: Commit**
```bash
git add .
git commit -m "feat: builder module with block-based prompt composition"
```

---

## Task 7: Lab Module

**Files:**
- Create: `app/lab/page.tsx`
- Create: `components/lab/LabEntry.tsx`

**Step 1: Write `components/lab/LabEntry.tsx`**
```tsx
import type { LabEntry } from '@/lib/types'
import { ToolTag } from '@/components/ui/Tag'
import { StarRating } from '@/components/ui/StarRating'

export default function LabEntryCard({ entry: e }: { entry: LabEntry }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 5, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: '#666' }}>{e.date}</span>
        <ToolTag tool={e.tool} />
        <span style={{ fontSize: 11, color: '#666' }}>{e.config}</span>
        <div style={{ marginLeft: 'auto' }}><StarRating value={e.rating} /></div>
      </div>

      <div className="mono" style={{ fontSize: 11.5, color: '#aaa', background: 'var(--bg)', border: '1px solid #3a3a3a', borderRadius: 3, padding: '8px 10px', lineHeight: 1.55, marginBottom: 14 }}>
        {e.prompt}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <LabField label="✓ Worked" color="#8ac86e">{e.worked}</LabField>
        <LabField label="✗ Failed" color="#c86e8a">{e.failed}</LabField>
      </div>

      {e.next && <LabField label="→ Next" color="var(--accent)">{e.next}</LabField>}
    </div>
  )
}

function LabField({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{children}</div>
    </div>
  )
}
```

**Step 2: Write `app/lab/page.tsx`**
```tsx
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

  return (
    <>
      <Topbar title="Lab" count={`${filtered.length} experiments`} />

      {/* Filter */}
      <div style={{ display: 'flex', background: 'var(--panel)', borderBottom: '1px solid var(--border)', padding: '0 16px', flexShrink: 0 }}>
        {[{ id: 'all' as const, label: 'All', color: 'var(--text-dim)' }, ...TOOLS.map(t => ({ id: t.id, label: t.label, color: t.color }))].map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            padding: '9px 14px', border: 'none', background: 'none', fontFamily: 'inherit',
            fontSize: 12.5, cursor: 'pointer', borderBottom: `2px solid ${filter === t.id ? t.color : 'transparent'}`,
            color: filter === t.id ? t.color : 'var(--text-dim)',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(e => <LabEntryCard key={e.id} entry={e} />)}
        {filtered.length === 0 && <div style={{ color: '#555', fontSize: 13, textAlign: 'center', paddingTop: 40 }}>No experiments yet.</div>}
      </div>
    </>
  )
}
```

**Step 3: Verify Lab**
Navigate to `localhost:3000/lab`. Expected: timeline of experiment entries, filter tabs per tool, worked/failed/next fields visible.

**Step 4: Commit**
```bash
git add .
git commit -m "feat: lab module — experiment diary with timeline"
```

---

## Task 8: GitHub + Vercel Deploy

**Step 1: Create `.gitignore`** (verify `.next` and `node_modules` are excluded — `create-next-app` handles this)

**Step 2: Create repo on GitHub**
```bash
gh repo create promptlab --public --description "Personal AI prompt management system" --source=. --remote=origin --push
```
(or create manually on github.com and push)

**Step 3: Deploy to Vercel**
```bash
npx vercel --yes
```
Follow prompts. Vercel auto-detects Next.js. Free tier is sufficient.

**Step 4: Update PROJECT.md** with live URL.

**Step 5: Final commit**
```bash
git add .
git commit -m "chore: add vercel config + update project docs"
git push
```

---

## Summary

| Task | Deliverable |
|------|------------|
| 1 | Next.js project + git |
| 2 | Layout shell + sidebar |
| 3 | Types + seed data + cheat sheet content |
| 4 | Library module (cards, search, detail) |
| 5 | Cheat Sheets module (tables, patterns) |
| 6 | Builder module (blocks, live preview) |
| 7 | Lab module (diary, timeline) |
| 8 | GitHub + Vercel deploy |
