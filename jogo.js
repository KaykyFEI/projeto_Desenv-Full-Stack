// Pega o elemento do HTML do canvas. É a "tela". Usei const porque o valor nunca será mudado
const canvas = document.getElementById("canvas");

// Esse é o pincel. Usasse ele para desenhar qualquer coisa na "tela". Usei const porque o valor nunca será mudado
const ctx = canvas.getContext("2d");

// Declaração do objeto nve
let nave = {
    posicao_x: 400,
    posicao_y: 10,
    largura: 30,
    altura: 30,
};

// Definição dos limites do canvas. Havia colocado dentro da função atualizarNave(), mas percebi que não faz sentido porque os seus valores não mudam durante o jogo.
const limite_canvas_x = canvas.width - nave.largura
const limite_canvas_y = canvas.height - nave.altura

// Substitui o puro document.addEventListener('keydown', (event)...) porque me incomodei com a lenta reacao quando uma tecla e pressionada constantemente. Pesquisei e encontrei uma solucao de criar um objeto é armazenar o estado das teclas nele. A cada frame do jogo(), ele lê o estado delas e atualiza a posição da nave. 

// Objeto que armazena o estado de cada tecla (true = pressionada, false = solta)
const teclaPressionada = {};

// Tecla pressionada = true
window.addEventListener('keydown', (tecla) => {
    // o ".code" retorna o código da tecla física, independente se é maiúscula ou minúscula
    teclaPressionada[tecla.code] = true;
});

// Tecla solta = false
window.addEventListener('keyup', (tecla) => {
    teclaPressionada[tecla.code] = false;
});

function atualizarNave() {
    if (teclaPressionada['ArrowUp'] || teclaPressionada['KeyW']) {
    nave.posicao_y -= 3;
    }

    if (teclaPressionada['ArrowDown'] || teclaPressionada['KeyS']) {
    nave.posicao_y += 3;
    }

    if (teclaPressionada['ArrowLeft'] || teclaPressionada['KeyA']) {
    nave.posicao_x -= 3;
    }

    if (teclaPressionada['ArrowRight'] || teclaPressionada['KeyD']) {
    nave.posicao_x += 3;
    }

    if (nave.posicao_x < 0) {
        nave.posicao_x = 0
    }

    if (nave.posicao_x > limite_canvas_x) {
        nave.posicao_x = limite_canvas_x
    }

    if (nave.posicao_y < 0) {
        nave.posicao_y = 0
    }

    if (nave.posicao_y > limite_canvas_y) {
        nave.posicao_y = limite_canvas_y
    }
};

// ------------- TIRO DO JOGADOR ---------------

// Lista para armazenar os projéteis da nave do jogador
let projeteis = []
// Função para atirar os projéteis
function criarProjetil() {
    // Objeto declarado com const pois não será reatribuído algum valor. Havia esquecido disso inicialmente.
    const projetil = {
        // Para o cálculo das posições do projétil, é utilizada as posições da nave + a sua largura e altura devido às posições serem (0,0) da nave.Altura é divida por 2 para sair do meio da nave.
        posicao_x: (nave.posicao_x + nave.largura),
        posicao_y: (nave.posicao_y + (nave.altura / 2)),
        cor: 'black',
        largura: 10,
        altura: 5,
        velocidade: 4
    };
    projeteis.push(projetil);
};

// Tive que criar uma função para cadenciar os tiros, senão seriam 60 por cada segundo da tecla espaço pressionada
const cadencia_projetil = 200; // Tempo mínimo entre os disparos em ms
let tempo_ultimo_disparo = 0; // Registra o tempo do último disparo

function cadenciaAtirar() {
    const tempoAtual = Date.now() // tempoAtual armazena o tempo exato em millisegundos no momento da execução da função
    if (tempoAtual - tempo_ultimo_disparo < cadencia_projetil) {
        return false;
    }
    else{
        tempo_ultimo_disparo = tempoAtual // Atualiza o tempo do último disparo
        return true;
    }
};

// Verifica se a tecla 'espaço' foi pressionada. Se sim, chama criarProjetil e cria um novo projetil.
function atirar() {
    if (teclaPressionada['Space'] && cadenciaAtirar()) {
        criarProjetil();
    };
}; 

// Verifica se foi criado um novo projetil por frame. Além disso, move todos já existentes na lista projeteis[].
function atualizarProjeteis() {
    atirar();
    // O parâmetro dentro do forEach é uma variável que nomeamos para facilitar a iteração
    projeteis.forEach((projetil) => {
        // Altera a posição do projétil com base na sua velocidade padrão
        projetil.posicao_x += projetil.velocidade
    });
    projeteis = projeteis.filter(projetil => projetil.posicao_x <= canvas.width)
};


// ------------------ GAME LOOP ----------------
// Função de "game loop"
function jogo() {
    // Fiquei em dúvida entre canvas.clienteWidth e canvas.width. Pesquisei e vi que o correto é o segundo pois o primeiro é utilizado para dimensionar o tamanho que o canvas ocupa fisicamente no layout da página.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // atualiza os dados
    // Função que atualiza a movimentação da nave do jogador
    atualizarNave();
    atualizarProjeteis();

    //desenha tudo novamente com os dados atualizados

    // Pinta o fundo
    ctx.fillStyle = 'lightblue';
    // Desenha o retângulo do canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a nave do jogador
    ctx.fillStyle = 'black';
    ctx.fillRect(nave.posicao_x, nave.posicao_y, nave.largura, nave.altura);

    // Desenha os projéteis
    projeteis.forEach((projetil) => {
        ctx.fillStyle = projetil.cor
        ctx.fillRect(projetil.posicao_x, projetil.posicao_y, projetil.largura, projetil.altura)
    })
        
    // Informa ao navegador que o código quer fazer uma animação. Dessa forma, ele sincroniza a frequência da animação com a do monitor e otimiza o desempenho. Ele solicita o próximo quadro nesse formato para gerar um loop
    requestAnimationFrame(jogo);
};

jogo();