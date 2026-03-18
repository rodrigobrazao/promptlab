# promptlab

> Gestão de prompts e ferramenta de aprendizagem pessoal para ferramentas de IA generativa.

**Estado:** Em planeamento
**Última actualização:** 2026-03-18

---

## O que é

App web pessoal (Next.js) para organizar, aprender e construir prompts para Midjourney, ComfyUI, Gemini e Freepik. Inspirada na estética do Nuke (The Foundry). Para uso pessoal e partilha open-source no GitHub.

## Módulos

| Módulo | Descrição |
|--------|-----------|
| **Library** | Biblioteca pessoal de prompts com pesquisa, filtros e detalhe |
| **Cheat Sheets** | Referência rápida de parâmetros e sintaxe por ferramenta |
| **Builder** | Compositor modular de prompts por blocos |
| **Lab** | Diário de experiências com imagens, notas e aprendizagens |

## Stack

- Next.js 14 · Tailwind CSS · Source Sans 3
- Dados em JSON no repositório (sem backend)
- Hosting: Vercel (gratuito)

## Ficheiros de documentação

| Ficheiro | Conteúdo |
|----------|---------|
| `docs/plans/2026-03-18-promptlab-design.md` | Design completo e aprovado |

## Contexto

Criado para um creative technologist que trabalha com TouchDesigner, p5.js, Three.js, Processing, instalações interativas, Arduino, Raspberry Pi, sensores e LiDAR. A app serve também como ferramenta de aprendizagem rápida das ferramentas de IA generativa.

---

## Deployment

| Item | Valor |
|------|-------|
| **Data** | 2026-03-18 |
| **GitHub** | Pendente — `gh` CLI não instalado. Instalar com `brew install gh`, autenticar com `gh auth login`, depois correr: `gh repo create promptlab --public --source=. --remote=origin --push` |
| **Vercel** | Pendente — sem sessão autenticada. Instalar com `npm i -g vercel`, autenticar com `vercel login`, depois correr: `vercel --yes` na raiz do projecto |

### Comandos prontos a executar após autenticação

```bash
# GitHub
brew install gh
gh auth login
cd "/Users/rbmacbookpro/Library/Mobile Documents/com~apple~CloudDocs/00_WORK/11_AI/promptlab"
gh repo create promptlab --public --description "Personal AI prompt management system — Midjourney, ComfyUI, Gemini, Freepik" --source=. --remote=origin --push

# Vercel (após GitHub push)
npm i -g vercel
vercel login
vercel --yes
```

---

*Backup automático — actualizar sempre que houver decisões de arquitectura ou mudanças de âmbito.*
