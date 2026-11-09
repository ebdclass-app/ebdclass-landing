# ebdclass-landing

Site de `ebdclass.com.br` (GitHub Pages, domínio em `CNAME`). HTML e CSS estáticos, sem build.

| Arquivo | O que é |
|---|---|
| `index.html` | A landing page. Textos, seções e dados estruturados (JSON-LD) ficam aqui |
| `landing.css` | Estilos da landing (`index.html`) |
| `landing.js` | Menu mobile, alternância mensal/semestral/anual, vídeo da chamada, carrossel da demonstração no celular, barra fixa do celular, aviso de cookies, animações e rastreamento de cliques |
| `style.css` | Estilos das páginas internas: `ajuda`, `termos`, `privacidade`, `exclusao-conta` |
| `img/` | Telas reais do app (WebP) e a imagem de compartilhamento `og-ebdclass.jpg` |
| `video/chamada.mp4` | Gravação real da chamada (10 s, sem som), a mesma do passo a passo do professor no app (`public/videos/professor/passo-1.mp4`), com a "Igreja Exemplo" |
| `robots.txt`, `sitemap.xml` | SEO. Atualize o `lastmod` do `sitemap.xml` quando mudar uma página |
| `llms.txt` | Resumo do produto para buscadores de IA (ChatGPT, Claude, Gemini, Perplexity). Confira preços e recursos quando mudar o plano |

## Como a página vende (09/11/2026)

A ordem das seções segue o caminho de quem chega do anúncio do Instagram, quase sempre pelo celular:

1. **Capa:** o que é (gestão da EBD, não só a caderneta), o botão verde "Quero experimentar na minha igreja" e as condições (15 dias, sem cartão, sem fidelidade).
2. **Perguntas:** seis perguntas que o secretário não sabe responder sem juntar cadernetas, cada uma com a resposta no EBD Class.
3. **Recursos:** os oito pilares da gestão (turmas, alunos, frequência, histórico, relatórios, professores, visão administrativa, congregações).
4. **Ver funcionando:** o vídeo da chamada e as cinco telas.
5. **Antes e depois**, **perfis** (secretário, superintendente, professor, pastor, campo), **teste grátis** (o que fazer em cada um dos dois domingos), **confiança**, **planos**, **dúvidas** (as objeções primeiro) e o **convite final**.

Regras que valem para a página inteira: um botão verde por tela (Brand Book); a **barra fixa** do celular só aparece depois da capa e some quando outro botão verde, o menu, o aviso de cookies ou o rodapé estão à vista; o **vídeo** só baixa quando aparece na tela e não toca sozinho para quem pediu menos movimento ou economia de dados; o **aviso de cookies** aparece no primeiro movimento de rolagem ou depois de 5 segundos, para a capa ser vista inteira (nada da Meta carrega antes da escolha).

O texto não promete nada que o app não faz. Antes de mudar uma frase sobre recurso, confira no app.

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
| `plan_cycle_toggle` | Troca entre mensal, semestral e anual (`cycle`) |
| `faq_open` | Abertura de uma pergunta |
| `section_view` | Primeira vez que cada seção passa pelo meio da tela |
| `demo_tab` | Troca de tela na demonstração do computador (`screen`) |
| `demo_video` | O vídeo da chamada começou a tocar (`modo`: `auto` ou `toque`) |

Os links para `app.ebdclass.com.br/cadastro` saem com `utm_source=site`, `utm_medium=landing`, `utm_campaign=cadastro` e `utm_content=<id do botão>`. Se o visitante chegar com UTMs próprias (anúncio, WhatsApp), elas são repassadas no lugar dessas. O `fbclid` do anúncio também segue para o cadastro.

Os botões (`data-cta`): `nav`, `hero_primary`, `hero_demo` (rola até o vídeo), `perguntas`, `demo_end`, `oferta`, `planos`, `final` e `sticky` (barra fixa do celular).

### Funil completo

O Umami do site e o da **tela de cadastro do app** usam o mesmo site (mesmo ID), então o funil fica num painel só. No Umami, em Relatórios > Funil, monte:

1. Visita de `/` (site)
2. Evento `cta_click` (clique em "Quero experimentar")
3. Visita de `/cadastro` (app)
4. Evento `cadastro_inicio` (pediu o código por e-mail)
5. Evento `cadastro_codigo_ok` (confirmou o código)
6. Evento `cadastro_conta_criada` (usuário e senha)
7. Evento `cadastro_igreja_criada` (cadastro concluído)

No app também saem `cadastro_retomado` (voltou à etapa em que parou, depois de o navegador recarregar) e `cadastro_erro` (`etapa` e, às vezes, `motivo`). Nenhum evento leva e-mail, nome, telefone ou usuário (`lib/funil.ts` no app).

O que vem depois do cadastro (primeira turma, alunos, professor, aula e **primeira chamada**) não é rastreado no navegador: depois do login o app não usa ferramenta de rastreamento (Política, item 2). Esses números vêm do banco, na aba **Funil** do painel do super-admin (`supabase/parte45` no app).

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
