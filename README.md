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

A análise é o **Umami Cloud** (cloud.umami.is): gratuito para este volume, sem cookies (o aviso de cookies do site é só por causa do Pixel da Meta, veja a seção abaixo). O script só é carregado quando `UMAMI_WEBSITE_ID` (no topo de `landing.js`) está preenchido; vazio, a página não envia nada a ninguém.

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

### Pixel da Meta (anúncios) e aviso de cookies

O Pixel é o conjunto de dados **"EBD Class"** (ID `1123546126807480`, no portfólio e na conta de anúncios "EBD Class" da Meta). O ID já está em `META_PIXEL_ID` no topo de `landing.js`; o site passa a mostrar o aviso e a carregar o Pixel (depois do "OK, aceito") assim que esta versão for para o `main`. Sem ID (vazio) não haveria Pixel, aviso nem cookie. Com o ID preenchido:

- O aviso de cookies aparece (criado por `landing.js`, estilo `.cookie` em `landing.css`) com **Prefiro não** e **OK, aceito**, os dois do mesmo tamanho e bem visíveis. O texto é curto e sem jargão, mas diz a finalidade (medir de onde vêm as visitas dos anúncios) e leva à Política. Não tire a finalidade nem esconda o "Prefiro não": o consentimento precisa ser informado e a recusa tão fácil quanto a aceitação (guia de cookies da ANPD). O Pixel só carrega depois do "OK, aceito".
- A escolha fica no cookie `ebd_cookies` (`sim` ou `nao`, 180 dias) do domínio `.ebdclass.com.br`. O app lê o mesmo cookie (`lib/consentimento-cookies.ts` no `ebdclass-app`), então a pessoa escolhe uma vez só.
- O link **Cookies** do rodapé (`#cookie-prefs`, escondido enquanto o Pixel está desligado) reabre o aviso. Quem aceitou e depois recusa tem os cookies `_fbp` e `_fbc` apagados e a página recarregada sem o Pixel.
- À Meta vão a visita (`PageView`), o clique no WhatsApp (`Contact`) e o clique em "teste grátis" (`CtaSignupClick`, para remarketing). O cadastro concluído é registrado no app (`CompleteRegistration`).
- A `privacidade.html` (itens 2, 3, 5, 6, 7 e 10) já descreve isso. Se mudar o que é enviado à Meta, mude o texto junto e troque `TERMOS_VERSAO` no app.

**Para ligar:**

1. Crie o Pixel no Gerenciador de Eventos da Meta e **desligue a "Correspondência avançada automática"** (e os "eventos automáticos") nas configurações dele. Com ela ligada, a Meta lê campos de formulário (e-mail, nome, telefone) e a Política deixaria de ser verdadeira.
2. Cole o ID (só números) em `META_PIXEL_ID` e o mesmo ID em `NEXT_PUBLIC_META_PIXEL_ID` na Vercel (app), com novo deploy.
3. Verifique o domínio `ebdclass.com.br` em Segurança da marca > Domínios.
4. Aceite o aviso e confira `PageView`, `Contact` e `CtaSignupClick` em "Testar eventos".

## Testar no computador

```bash
python3 -m http.server 8099   # http://localhost:8099
```
