# Projeto de Programação Full Stack - 1° Semestre
# AstroTiro

> Jogo shoot 'em up espacial desenvolvido como projeto da disciplina **CCP120 - Programação Full Stack** (FEI - Centro Universitário FEI, 1º semestre).

---

## Sobre o Projeto

AstroTiro é um jogo de tiro espacial em 2D, jogado diretamente pelo navegador. O jogador controla uma nave que precisa abater inimigos que invadem o setor, evitando colisões e gerenciando a vida. A dificuldade aumenta progressivamente com o tempo, exigindo reflexos cada vez mais precisos.

O projeto contempla as três camadas do desenvolvimento web ensinadas na disciplina:

- **Front-End:** HTML5 semântico, CSS3 (com Flexbox) e JavaScript puro
- **Game:** Renderização e lógica via Canvas 2D
- **Back-End:** Servidor Node.js com Express servindo os arquivos estáticos

---

## Tecnologias Utilizadas

- **HTML5** — estrutura das três páginas (Sobre, Desenvolvedor, Jogar)
- **CSS3** — estilização com Flexbox e tema espacial
- **JavaScript (ES6)** — toda a lógica do jogo, sem frameworks
- **Canvas 2D API** — renderização do jogo
- **Node.js + Express** — servidor para hospedar o site localmente

---

## Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 14 ou superior)

### Passo a passo

1. Clone ou baixe este repositório
2. Abra o terminal na pasta do projeto
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

5. Abra o navegador em:

```
http://localhost:3000
```

---

## Estrutura do Projeto

```
projeto/
├── index.html              # Página principal (sobre o jogo)
├── desenvolvedor.html      # Página do desenvolvedor (currículo e créditos)
├── jogo.html               # Página com o jogo embarcado
├── servidor.js             # Servidor Node.js (Express)
├── package.json            # Dependências e scripts do projeto
├── README.md               # Este arquivo
├── css/
│   └── estilos.css         # Estilos visuais (tema espacial)
└── js/
    └── jogo.js             # Toda a lógica do jogo
```

---

## Como Jogar

### Objetivo

Sobreviva o máximo possível abatendo as naves inimigas que invadem o setor. Cada inimigo abatido aumenta sua pontuação. O jogo termina quando a vida da nave chega a zero.

### Controles

| Tecla | Ação |
|-------|------|
| `W` ou `↑` | Mover para cima |
| `S` ou `↓` | Mover para baixo |
| `A` ou `←` | Mover para a esquerda |
| `D` ou `→` | Mover para a direita |
| `Espaço` | Disparar projétil |

### Mecânicas

- **Vida:** A nave começa com 100 pontos de vida
- **Dano por colisão direta:** Inimigos que tocam a nave causam **10 de dano**
- **Dano por invasão:** Inimigos que cruzam a borda esquerda causam **5 de dano**
- **Cooldown de tiro:** 200ms entre cada disparo
- **Dificuldade progressiva:** A velocidade dos inimigos e da nave cresce exponencialmente com o tempo (~5% a cada 10 segundos)

---

## Estética Visual

- **Fundo espacial** com 100 estrelas geradas proceduralmente, com efeito de parallax
- **Nave do jogador:** triângulo ciano apontando para a direita
- **Inimigos:** triângulos vermelhos apontando para a esquerda
- **Projéteis:** lasers amarelos
- **Zona de perigo:** gradiente vermelho na borda esquerda
- **Feedback de dano:** flash branco na tela ao tomar dano

---

## Desenvolvedor

- **Nome:** Kayky Ribeiro Pinheiro
- **RA:** 72.126.031-3
- **E-mail:** feispkpinheiro@fei.edu.br
- **Curso:** Ciência da Computação - 1º Período

---

## Créditos e Referências

### Uso de IA Generativa

Durante o desenvolvimento, foi utilizado o **Claude (Anthropic)** como ferramenta de aprendizado guiado. A IA atuou como mentor seguindo o método socrático, fazendo perguntas direcionadas em vez de fornecer soluções diretas. Todo o código foi escrito, testado e compreendido pelo desenvolvedor.

### Pesquisas e Referências

- [MDN Web Docs](https://developer.mozilla.org/) — documentação oficial do Canvas API, `requestAnimationFrame`, eventos de teclado, `setInterval` e métodos de array (`forEach`, `filter`, `push`)
- Conceito de **Game Loop** pesquisado de forma independente
- Sistema de **cooldown (rate limiting)** inspirado em padrões clássicos de jogos
- Material das aulas da disciplina CCP120 (slides de HTML, CSS, JavaScript, Canvas e Servidor)

### Recursos Externos

Nenhum sprite, som ou recurso de terceiros foi utilizado. Toda a renderização gráfica é feita proceduralmente via Canvas 2D.

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais — disciplina CCP120, FEI, 2026.