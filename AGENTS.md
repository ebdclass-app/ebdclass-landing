# Identidade visual: siga o Brand Book

Antes de criar ou mudar qualquer coisa que alguém vê neste site (seção, página, botão, imagem, texto), leia o Brand Book do EBD Class e siga-o. Ele fica no repositório do app, `ebdclass-app`: `docs/marca/brand-book.html` (mesmo conteúdo do `docs/marca/EBD-Class-Brand-Book.pdf`). O manual é a regra; o que já existe aqui só serve de exemplo quando concorda com ele. Se o que for pedido não couber no manual, pergunte antes de criar um padrão novo.

O que mais aparece no site (o manual tem os detalhes e o porquê):

- **Logotipo:** só `logo.svg` (fundos claros) e `logo-branco.svg` (fundos escuros); favicon em `favicon.ico` e `favicon.svg`. Os originais ficam em `docs/marca/arquivos/` no `ebdclass-app`. Nunca redigitar "EBD Class" imitando o logo nem clarear com filtro CSS. Área livre em volta igual à altura do "E"; mínimo de 120 px de largura.
- **Nome:** "EBD Class", com espaço. "EBDClass" só no `alternateName` do JSON-LD, no `llms.txt` e em endereços.
- **Cores:** as variáveis do `:root` em `landing.css` já seguem o manual: Azul EBD `#092F7D` (`--blue`), Azul Vivo `#1A5CFF` (`--brand`), Verde Presença `#00C896` (`--green`, botão principal com texto `#03163F`), Verde Texto `#00785A` (`--green-ink`), Azul Profundo `#0D1933` (`--navy` e `--ink`, a cor do texto), Ardósia `#5A6785` (`--muted`), Linha `#D4DCF0` (`--line`), Névoa `#F4F7FF` (`--bg`). Use as variáveis; cor nova, só se estiver no manual. Degradê da capa: `#092F7D` → `#061B4D` com os brilhos azul e verde.
- **Contraste:** texto com pelo menos 4,5 : 1 sobre o fundo; verde `#00C896` nunca como texto sobre branco.
- **Tipografia:** Nunito Sans em tudo (400 a 900). Playfair Display itálico 600 só para uma a cinco palavras de destaque nos títulos (`<em>` dentro de `h1`/`h2`). A Antenna é só do logotipo.
- **Forma:** botões em pílula com altura mínima de 48 px, um botão verde por tela; rótulos de seção com o traço (`.kicker`); sombras puxadas para o azul.
- **Voz:** a língua da EBD (chamada, turma, aluno, secretário). "Painel", não "dashboard"; "teste grátis", não "trial". Frases curtas e números concretos (15 dias, 3 minutos).
- **Imagens:** telas reais do app com a "Igreja Exemplo" e alunos fictícios (veja o README).

Mudou algo da marca? A mudança começa no Brand Book do `ebdclass-app` (nova versão no capítulo 17) e depois vem para cá.
