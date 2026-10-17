# ebdclass-landing

Site de `ebdclass.com.br` (GitHub Pages, domínio em `CNAME`). HTML e CSS estáticos, sem build.

| Arquivo | O que é |
|---|---|
| `index.html` | A landing page. Textos, seções e dados estruturados (JSON-LD) ficam aqui |
| `landing.css` | Estilos da landing (`index.html`) |
| `landing.js` | Menu mobile, alternância mensal/anual, animações e rastreamento de cliques |
| `style.css` | Estilos das páginas internas: `ajuda`, `termos`, `privacidade`, `exclusao-conta` |
| `img/` | Telas reais do app (WebP) e a imagem de compartilhamento `og-ebdclass.jpg` |
| `robots.txt`, `sitemap.xml` | SEO. Atualize o `lastmod` do `sitemap.xml` quando mudar uma página |
| `llms.txt` | Resumo do produto para buscadores de IA (ChatGPT, Claude, Gemini, Perplexity). Confira preços e recursos quando mudar o plano |

## Antes de mudar preço, plano ou condição

A fonte dos preços é `lib/faixas.ts` no repositório `ebdclass-app`. Se mudar lá, mude também a tabela de planos em `index.html` (`data-m` e `data-a` de cada `.tier`, o texto visível o `AggregateOffer` no JSON-LD e a lista de preços do `llms.txt`). O que cada plano libera está em `lib/plano.ts` do app.

## Telas do app em `img/`

São quadros extraídos dos vídeos de passo a passo do app (`public/videos/` no `ebdclass-app`), com a "Igreja Exemplo" e alunos fictícios. Quando o visual do app mudar, grave de novo e troque os arquivos mantendo os nomes e as proporções (600×1298 no celular, 1120×700 no computador).

## Medição

A análise é o **Umami Cloud** (cloud.umami.is): gratuito para este volume, sem cookies e sem aviso de cookies. O script só é carregado quando `UMAMI_WEBSITE_ID` (no topo de `landing.js`) está preenchido; vazio, a página não envia nada a ninguém.

Para ativar: crie a conta no Umami Cloud, adicione o site `ebdclass.com.br`, copie o *Website ID* e cole em `UMAMI_WEBSITE_ID`. O script ignora acessos de outros domínios (localhost, prévias) e respeita o "Não rastrear" do navegador.

Os eventos também vão para `window.dataLayer` e, se existirem, para `gtag()` ou `plausible()`:

| Evento | Quando |
|---|---|
| `cta_click` | Clique em qualquer botão com `data-cta` (`cta_id`, `cta_text`, `destination` = `signup` ou `anchor`, `section`) |
| `login_click`, `whatsapp_click`, `play_store_click` | Cliques nesses links (`where` diz o lugar) |
| `plan_cycle_toggle` | Troca entre mensal e anual |
| `faq_open` | Abertura de uma pergunta |
| `section_view` | Primeira vez que cada seção passa pelo meio da tela |

Os links para `app.ebdclass.com.br/cadastro` saem com `utm_source=site`, `utm_medium=landing`, `utm_campaign=cadastro` e `utm_content=<id do botão>`. Se o visitante chegar com UTMs próprias (anúncio, WhatsApp), elas são repassadas no lugar dessas.

Para ver os eventos sem painel, abra a página com `?ebd_debug=1` e o console do navegador.

Cadastro concluído, primeiro uso e pagamento acontecem no app, que hoje não tem análise.

## Testar no computador

```bash
python3 -m http.server 8099   # http://localhost:8099
```
