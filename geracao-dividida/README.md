# A Geração Dividida — experiência interactiva

Single-file p5.js. Abrir `index.html` directamente no browser (ou servir com `python3 -m http.server`).

## Estrutura

8 secções, cada uma um mini-jogo visual minimalista. O perfil do utilizador cresce em silêncio entre secções e é revelado na 07.

| # | Secção | Mecânica | O que mede |
|---|---|---|---|
| 01 | O Ponto | arrasta um ponto sem eixos visíveis | quadrante ideológico |
| 02 | Os Dois | toca o círculo que te representa | género |
| 03 | O Mapa | toca onde vives no mapa de PT | geografia |
| 04 | O Feed | scroll vertical de cards | tempo por tema |
| 05 | A Linha | arrasta entre discordo/concordo | 6 afirmações |
| 06 | O Tempo | arrasta a timeline 2015→2024 | (contexto) |
| 07 | O Espelho | revela cluster + % sobreposição | — |
| 08 | Os Números | crus, em silêncio | — |

## Dados

Todos os dados estão no objecto `DATA` no fim de `index.html`. Substituir aí pelos números reais quando estiverem validados:

- `DATA.quadrants` — distribuição por quadrante (4 valores)
- `DATA.chegaShare` — % voto Chega <35 por género
- `DATA.regions` — 18 regiões com `chega` % (e coordenadas no mapa estilizado)
- `DATA.feedThemes` + `DATA.feedCards` — citações por tema (≥15 cards)
- `DATA.statements` — 6 afirmações com flag `conservative`
- `DATA.timeline` — eventos 2015-2024
- `DATA.eurobarGap` — pp do fosso Eurobarómetro
- `DATA.clusters` — 6 perfis com vector + traits

## Camadas subliminares activas

- **Pan L/R** — actualizado em 01 (quadrante), 04 (cada card consumido) e 05 (cada resposta conservadora). Som desliza sem aviso.
- **Sem barra de progresso real** — só 8 traços no fundo, sem percentagem.
- **Cards adaptativos** — em 04, os primeiros cards estabelecem o ritmo; tempo medido define o tema dominante.
- **Cluster matching** — vector pessoal cruzado com 6 vectores de cluster por similaridade ponderada (peso maior em `gender` e `conservativeScore`).
