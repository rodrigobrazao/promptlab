# promptlab — Design Document
**Data:** 2026-03-18
**Status:** Aprovado
**Autor:** rbmacbookpro + Claude

---

## Visão Geral

**promptlab** é uma aplicação web pessoal de gestão de prompts e ferramenta de aprendizagem acelerada para ferramentas de IA generativa. Destinada a uso pessoal e partilha open-source no GitHub.

**Perfil do utilizador:** Creative technologist e artista generativo — TouchDesigner, p5.js, Three.js, Processing, instalações interativas, Arduino, Raspberry Pi, sensores, LiDAR. Sem experiência prévia nas ferramentas de IA que a app suporta. Objetivo: aprender rápido, de forma prática e estruturada.

**Ferramentas suportadas:** Midjourney · ComfyUI · Gemini · Freepik

---

## Stack Técnica

| Componente | Escolha |
|-----------|---------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Tipografia | Source Sans 3 (Google Fonts) |
| Dados | Ficheiros JSON no repositório |
| Hosting | Vercel (gratuito) ou GitHub Pages |
| Backend | Nenhum — client-side only |

---

## Estética Visual

Inspirada na interface do **Nuke (The Foundry)** e tipografia **Adobe After Effects** (Source Sans).

| Token | Valor |
|-------|-------|
| Background | `#272727` |
| Panel | `#2f2f2f` |
| Panel highlight | `#383838` |
| Border | `#404040` |
| Text | `#d8d4cc` |
| Text dim | `#888888` |
| Accent (âmbar) | `#c8a96e` |
| Tag Midjourney | `#6e9ec8` (azul) |
| Tag ComfyUI | `#8ac86e` (verde) |
| Tag Gemini | `#c86e8a` (rosa) |
| Tag Freepik | `#9b6ec8` (roxo) |

Layout: sidebar fixa à esquerda + área de conteúdo + painel de detalhe lateral.

---

## Módulos

### 1. Library
Biblioteca pessoal de prompts guardados.

**Funcionalidades:**
- Grid de cards com prompt, ferramenta, tags e nota rápida
- Filtro por ferramenta (MJ / ComfyUI / Gemini / Freepik)
- Pesquisa por texto livre (prompt, tags, notas)
- Painel de detalhe lateral com: prompt completo, parâmetros parseados, rating (1–5 estrelas), notas pessoais, data
- Ações: Copy, Edit, Delete
- Criar novo prompt via modal

**Estrutura de dados (`prompts.json`):**
```json
{
  "id": "uuid",
  "title": "Volumetric Light — Fog Layer",
  "tool": "midjourney",
  "prompt": "god rays through dense fog...",
  "params": { "ar": "16:9", "v": "6", "stylize": "750" },
  "tags": ["lighting", "atmosphere"],
  "rating": 4,
  "note": "Funciona bem com instalações...",
  "createdAt": "2026-03-18"
}
```

---

### 2. Cheat Sheets
Referência rápida de sintaxe e parâmetros por ferramenta.

**Funcionalidades:**
- Uma página por ferramenta (tabs)
- Tabela de parâmetros: nome · tipo · descrição · exemplo · copy button
- Secção de patterns: exemplos de estrutura de prompt completos
- Notas pessoais editáveis inline (guardadas em localStorage)

**Conteúdo inicial:**
- **Midjourney:** `--v`, `--ar`, `--stylize`, `--chaos`, `--no`, `--seed`, `--tile`, `--iw`, `--cref`
- **ComfyUI:** samplers, schedulers, nodes essenciais (KSampler, CLIP, VAE), CFG scale
- **Gemini:** temperature, safety settings, system instructions, multimodal patterns
- **Freepik:** style modifiers, aspect ratios, quality settings

---

### 3. Builder
Compositor modular de prompts por blocos.

**Funcionalidades:**
- Selecção de ferramenta alvo (altera blocos disponíveis e sintaxe)
- Blocos modulares:
  - **Sujeito** — o quê / quem
  - **Estilo** — referências visuais, artistas, movimentos
  - **Lighting** — tipo de iluminação
  - **Mood** — tom emocional e atmosfera
  - **Técnico** — parâmetros específicos da ferramenta
- Preview do prompt final em tempo real
- Botão: Copy · Save to Library

---

### 4. Lab
Diário de experiências — notebook de investigação pessoal.

**Funcionalidades:**
- Vista em linha do tempo (mais recente primeiro)
- Cada entrada: prompt usado · ferramenta · configuração · imagem de resultado (upload) · o que funcionou · o que falhou · próximos passos
- Filtro por ferramenta e rating
- Link opcional para prompt na Library
- Exportar entrada como Markdown

**Estrutura de dados (`lab.json`):**
```json
{
  "id": "uuid",
  "date": "2026-03-18",
  "promptId": "uuid ou null",
  "tool": "midjourney",
  "prompt": "...",
  "config": "v6, stylize 750",
  "image": "lab/2026-03-18-001.jpg",
  "worked": "A luz volumétrica ficou muito convincente",
  "failed": "O foreground ficou muito vazio",
  "next": "Adicionar elementos de foreground, tentar --chaos 15",
  "rating": 4
}
```

---

## Estrutura do Repositório

```
promptlab/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # redirect → /library
│   ├── library/page.tsx
│   ├── cheatsheets/page.tsx
│   ├── builder/page.tsx
│   └── lab/page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── library/
│   │   ├── PromptCard.tsx
│   │   └── DetailPanel.tsx
│   ├── cheatsheets/
│   │   └── ParamTable.tsx
│   ├── builder/
│   │   └── BlockBuilder.tsx
│   └── lab/
│       └── LabEntry.tsx
├── data/
│   ├── prompts.json
│   ├── lab.json
│   └── cheatsheets/
│       ├── midjourney.json
│       ├── comfyui.json
│       ├── gemini.json
│       └── freepik.json
├── public/
│   └── lab/                  # imagens de resultados
├── styles/
│   └── globals.css
└── docs/
    └── plans/
        └── 2026-03-18-promptlab-design.md
```

---

## Decisões de Design

| Decisão | Razão |
|---------|-------|
| Sem backend | Simplicidade, sem custos, dados no repo |
| JSON no repo | Dados versionados com o código, backup automático via git |
| Client-side only | Deploy trivial, funciona em GitHub Pages |
| localStorage para notas Cheat Sheets | Dados pessoais que não precisam de versioning |
| Upload de imagens local (public/) | Sem serviço externo, tudo auto-contido |
