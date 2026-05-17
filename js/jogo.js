// Pega o elemento do HTML do canvas. É a "tela". Usei const porque o valor nunca será mudado
const canvas = document.getElementById("canvas");

// Esse é o pincel. Usasse ele para desenhar qualquer coisa na "tela". Usei const porque o valor nunca será mudado
const ctx = canvas.getContext("2d");

// Captura o botão de iniciar do HTML para controlar quando o jogo começa
const botaoIniciar = document.getElementById("botao-iniciar");

// ------------------ PONTUAÇÃO ----------------
// Variável que armazena quantos inimigos foram abatidos
let pontuacao = 0

// ------------- FONTES ---------------
// Tive dificuldade em saber como redimensionar as fontes. Cheguei a conclusão de criar 3 variáveis com tamanhos diferentes. Cada uma usa a largura do canvas e calcula a fonte.
const tamanho_fonte_normal = canvas.width * 0.025 // aproximadamente 20px em canvas 800
const tamanho_fonte_medio = canvas.width * 0.03 // aproximadamente 40px em canvas 800
const tamanho_fonte_grande = canvas.width * 0.05 // aproximadamente 24px em canvas 800

// Cria uma margem proporcional para posicionamento
const margem = canvas.width * 0.0125;  // aproximadamente 10px em canvas 800

// ------------- PALETA DE CORES (TEMA ESPACIAL) ---------------
// Centraliza as cores em constantes para facilitar manutenção e manter consistência visual
const COR_FUNDO = '#0a0a1a';           // Azul escuro quase preto (espaço)
const COR_ESTRELAS = '#ffffff';        // Brancas
const COR_NAVE = '#00ffff';            // Ciano (visual de "tecnologia")
const COR_INIMIGO = '#ff3333';         // Vermelho vivo (perigo)
const COR_PROJETIL = '#ffff66';        // Amarelo (laser)
const COR_TEXTO = '#ffffff';           // Branco para contrastar com o fundo escuro
const COR_ZONA_PERIGO = '#ff0000';     // Vermelho para a linha de aviso da borda esquerda

// ------------- FUNDO ESTRELADO ---------------
// Cria um efeito de espaço com estrelas geradas proceduralmente que se movem lentamente para a esquerda,
// criando uma sensação de movimento da nave pelo espaço (efeito parallax)

const estrelas = []; // Lista que armazena todas as estrelas do cenário
const quantidade_estrelas = 100; // Quantidade total de estrelas na tela

// Cria as estrelas uma única vez no início do jogo com posições e tamanhos aleatórios
function criarEstrelas() {
    for (let i = 0; i < quantidade_estrelas; i++) {
        estrelas.push({
            posicao_x: Math.random() * canvas.width,
            posicao_y: Math.random() * canvas.height,
            tamanho: Math.random() * 2 + 0.5, // Tamanho varia entre 0.5 e 2.5 pixels
            velocidade: Math.random() * 0.5 + 0.1 // Velocidades diferentes para criar profundidade (parallax)
        });
    }
}

// Atualiza a posição de cada estrela a cada frame, movendo-as para a esquerda
// Quando uma estrela sai da tela, reaparece na direita em uma nova altura aleatória
function atualizarEstrelas() {
    estrelas.forEach((estrela) => {
        estrela.posicao_x -= estrela.velocidade;
        if (estrela.posicao_x < 0) {
            estrela.posicao_x = canvas.width;
            estrela.posicao_y = Math.random() * canvas.height;
        }
    });
}

// Desenha todas as estrelas no canvas
function desenharEstrelas() {
    ctx.fillStyle = COR_ESTRELAS;
    estrelas.forEach((estrela) => {
        ctx.fillRect(estrela.posicao_x, estrela.posicao_y, estrela.tamanho, estrela.tamanho);
    });
}

criarEstrelas(); // Inicializa as estrelas

// ------------------ NAVE JOGADOR ------------------
// Declaração do objeto nave
let nave = {
    posicao_x: 400,
    posicao_y: 10,
    largura: 30,
    altura: 15,
    vida: 100,
    velocidade: 2.3
};

// Definição dos limites do canvas. Havia colocado dentro da função atualizarNave(), mas percebi que não faz sentido porque os seus valores não mudam durante o jogo.
const limite_canvas_x = canvas.width - nave.largura
const limite_canvas_y = canvas.height - nave.altura

// Substitui o puro document.addEventListener('keydown', (event)...) porque me incomodei com a lenta reacao quando uma tecla e pressionada constantemente. Pesquisei e encontrei uma solucao de criar um objeto é armazenar o estado das teclas nele. A cada frame do jogo(), ele lê o estado delas e atualiza a posição da nave. 

// Objeto que armazena o estado de cada tecla (true = pressionada, false = solta)
const teclaPressionada = {};

// Lista das teclas que o jogo usa. Adicionado posteriormente para prevenir que o navegador role a página ao pressionar Espaço ou setas durante o jogo.
const teclas_do_jogo = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'];

// Tecla pressionada = true
window.addEventListener('keydown', (tecla) => {
    // o ".code" retorna o código da tecla física, independente se é maiúscula ou minúscula

    // Se a tecla pressionada está na lista das teclas do jogo, cancela o comportamento padrão do navegador (como rolar a página com Espaço ou setas)
    if (teclas_do_jogo.includes(tecla.code)) {
        tecla.preventDefault();
    }

    teclaPressionada[tecla.code] = true;
});

// Tecla solta = false
window.addEventListener('keyup', (tecla) => {
    teclaPressionada[tecla.code] = false;
});

function atualizarNave() {
    if (teclaPressionada['ArrowUp'] || teclaPressionada['KeyW']) {
        nave.posicao_y -= nave.velocidade;
    }

    if (teclaPressionada['ArrowDown'] || teclaPressionada['KeyS']) {
        nave.posicao_y += nave.velocidade;
    }

    if (teclaPressionada['ArrowLeft'] || teclaPressionada['KeyA']) {
        nave.posicao_x -= nave.velocidade;
    }

    if (teclaPressionada['ArrowRight'] || teclaPressionada['KeyD']) {
        nave.posicao_x += nave.velocidade;
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

// Tive que criar uma função para cadenciar os tiros, senão seriam 60 por cada segundo da tecla espaço pressionada
const cadencia_projetil = 200; // Tempo mínimo entre os disparos em ms
let tempo_ultimo_disparo = 0; // Registra o tempo do último disparo

// Função para atirar os projéteis
function criarProjetil() {
    // Objeto declarado com const pois não será reatribuído algum valor. Havia esquecido disso inicialmente.
    const projetil = {
        // Para o cálculo das posições do projétil, é utilizada as posições da nave + a sua largura e altura devido às posições serem (0,0) da nave.Altura é divida por 2 para sair do meio da nave.
        posicao_x: (nave.posicao_x + nave.largura),
        posicao_y: (nave.posicao_y + (nave.altura / 2)),
        cor: COR_PROJETIL, // Cor amarela do laser, vinda da paleta de cores
        largura: 14,
        altura: 10,
        velocidade: 3.5,
        colidiu: false // inserido posteriormente para verificar colisão
    };
    projeteis.push(projetil);
}

function cadenciaAtirar() {
    const tempoAtual = Date.now() // tempoAtual armazena o tempo exato em millisegundos no momento da execução da função
    if (tempoAtual - tempo_ultimo_disparo < cadencia_projetil) {
        return false;
    }
    else {
        tempo_ultimo_disparo = tempoAtual // Atualiza o tempo do último disparo
        return true;
    }
};

// Verifica se a tecla 'espaço' foi pressionada. Se sim, chama criarProjetil e cria um novo projetil.
function atirar() {
    if (teclaPressionada['Space'] && cadenciaAtirar()) {
        criarProjetil();
    };
}

// Verifica se foi criado um novo projetil por frame. Além disso, move todos já existentes na lista projeteis[].
function atualizarProjeteis() {
    atirar();
    // O parâmetro dentro do forEach é uma variável que nomeamos para facilitar a iteração
    projeteis.forEach((projetil) => {
        // Altera a posição do projétil com base na sua velocidade padrão
        projetil.posicao_x += projetil.velocidade
    });
    projeteis = projeteis.filter(projetil => projetil.posicao_x <= canvas.width)
}


// --------------- INIMIGOS ---------------------------------

// Lista de com os objetos inimigo
let inimigos = []

// Função para gerar uma posição aleatório dos inimigos
function terPosicaoAleatorioInimigos(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
};

// Função para criar inimigo
function criarInimigo() {
    // Objeto inimigo com atributos padrões
    const inimigo = {
        largura: 40,
        altura: 20,
        vida: 100,
        posicao_x: canvas.width - 40, // havia utilizado inimigo.largura, mas não serve porque ainda não foi criada.
        posicao_y: terPosicaoAleatorioInimigos(canvas.height - 20, 0), // havia feito canvas.height / 2, mas todos iriam surgir no mesmo ponto. Agora está com uma função de aleatorieadade
        velocidade: 1,
        dano: 15,
        cor: COR_INIMIGO, // Cor vermelha vinda da paleta de cores
        colidiu: false // inserido posteriormente para verificar colisão
    };
    inimigos.push(inimigo);

}

// Variável que guardará o ID do intervalo de criação de inimigos.
// Alterado de const para let porque agora o intervalo é iniciado/parado dinamicamente pelo botão de início.
let intervaloInimigos = null;

function atualizarInimigos() {
    inimigos.forEach((inimigo => {
        inimigo.posicao_x -= inimigo.velocidade
    }));

    // Antes de filtrar, verifica cada inimigo que saiu da tela pela esquerda e aplica dano à nave
    inimigos.forEach((inimigo) => {
        if (inimigo.posicao_x <= 0) {
            nave.vida -= 5;
            ativarFlashDano(); // Aciona o efeito visual de dano
        }
    });

    inimigos = inimigos.filter(inimigo => inimigo.posicao_x > 0)
}

// ------------------ SISTEMA DE COLISÃO ------------------------

// Função para verificar se o projétil do jogador colidiu com o inimigo
function verificarColisao(elemento1, elemento2) { // Nomes genéricos foram inseridos posteriormente nos argumetnos para reutilizar a função em diferentes contextos
    if (
        // Verifica se o projétil está sobrepondo o inimigo
        elemento1.posicao_x + elemento1.largura > elemento2.posicao_x &&
        elemento1.posicao_y + elemento1.altura > elemento2.posicao_y &&

        // Verifica se o projétil ultrapassou o inimigo
        elemento1.posicao_x < elemento2.posicao_x + elemento2.largura &&
        elemento1.posicao_y < elemento2.posicao_y + elemento2.altura
    ) {
        return true;
    }

    else {
        return false
    }
}

// Essa função irá verificar se o projétil atingiu algum inimigo e armazerá o resultado. Está aninhando pois verificar o projétil com cada inimigo existente.
function verificarColisoesProjetil() {
    projeteis.forEach((projetil => {
        inimigos.forEach((inimigo => {
            if (verificarColisao(projetil, inimigo)) {
                // Se verdade, marca os dois como colididos
                projetil.colidiu = true;
                inimigo.colidiu = true;
                pontuacao += 1;
            }
        }))
    }))

    // Remove os que colidiram das duas listas
    projeteis = projeteis.filter(projetil => !projetil.colidiu)
    inimigos = inimigos.filter(inimigo => !inimigo.colidiu)
}

// Essa função é responsável por identificar se o inimigo colidiu com a nave do jogador e, se sim, deverá sumir e diminuir a vida da mesmo
function verificarColisaoNave() {
    inimigos.forEach((inimigo => {
        if (verificarColisao(inimigo, nave)) {
            // Se verdade, marca o inimigo como colidido
            inimigo.colidiu = true;
            nave.vida += -10
            ativarFlashDano(); // Aciona o efeito visual de dano
        }
    }));

    // Remove os inimigos que colidiram
    inimigos = inimigos.filter(inimigo => !inimigo.colidiu)
}

// ------------------ PROGRESSÃO DE DIFICULDADE ----------------
// Aumenta exponencialmente a velocidade da nave e dos inimigos com base no tempo decorrido

// Variável que marca o momento em que o jogo começou.
// Alterado de const para let porque agora é definido apenas quando o jogador clica em "Iniciar".
let tempo_inicio_jogo = 0;

// Velocidades base, guardadas para servir de referência ao aplicar o multiplicador
const velocidade_base_nave = 2.3;
const velocidade_base_inimigo = 1;

// Função que calcula um multiplicador exponencial baseado no tempo decorrido
// 1.05 ^ (tempo / 10) faz o valor crescer ~5% a cada 10 segundos
function calcularMultiplicador() {
    const tempo_decorrido = (Date.now() - tempo_inicio_jogo) / 1000;
    return Math.pow(1.05, tempo_decorrido / 10);
}

// Atualiza a velocidade da nave e de todos os inimigos com base no tempo
function atualizarDificuldade() {
    const multiplicador = calcularMultiplicador();
    nave.velocidade = velocidade_base_nave * multiplicador;
    inimigos.forEach((inimigo) => {
        inimigo.velocidade = velocidade_base_inimigo * multiplicador;
    });
}

// ------------------ EFEITO VISUAL DE DANO (FLASH) ----------------
// Quando a nave toma dano, a tela "pisca" branca por alguns milissegundos para reforçar visualmente o impacto

const duracao_flash = 150; // Duração do flash em milissegundos
let tempo_inicio_flash = 0; // Quando o flash foi acionado pela última vez

// Marca o momento atual como início do flash
function ativarFlashDano() {
    tempo_inicio_flash = Date.now();
}

// Desenha o overlay branco semi-transparente se o flash estiver ativo
function desenharFlashDano() {
    const tempo_decorrido = Date.now() - tempo_inicio_flash;
    if (tempo_decorrido < duracao_flash) {
        // Quanto mais tempo passa, mais transparente o overlay fica (efeito de fade)
        const opacidade = 1 - (tempo_decorrido / duracao_flash);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacidade * 0.5})`; // 0.5 para não cegar o jogador
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// ------------------ FUNÇÕES DE DESENHO PERSONALIZADAS ----------------

// Desenha um triângulo apontando para a direita (para a nave do jogador)
// Usado em vez de fillRect para dar uma estética mais espacial
function desenharTrianguloDireita(x, y, largura, altura, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();              // Inicia um novo caminho
    ctx.moveTo(x, y);             // Canto superior esquerdo
    ctx.lineTo(x + largura, y + altura / 2); // Ponta direita (meio)
    ctx.lineTo(x, y + altura);    // Canto inferior esquerdo
    ctx.closePath();              // Fecha o triângulo
    ctx.fill();                   // Preenche com a cor definida
}

// Desenha um triângulo apontando para a esquerda (para os inimigos)
function desenharTrianguloEsquerda(x, y, largura, altura, cor) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(x + largura, y);              // Canto superior direito
    ctx.lineTo(x, y + altura / 2);           // Ponta esquerda (meio)
    ctx.lineTo(x + largura, y + altura);     // Canto inferior direito
    ctx.closePath();
    ctx.fill();
}

// Desenha uma linha vertical vermelha semi-transparente na borda esquerda do canvas
// Para indicar visualmente a "zona de perigo" onde os inimigos causam dano
function desenharZonaPerigo() {
    // Gradiente que vai do vermelho semi-transparente (esquerda) ao totalmente transparente (direita)
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width * 0.08, 0);
    gradiente.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
    gradiente.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width * 0.08, canvas.height);
}

// ------------------ GAME LOOP ----------------

let animacaoId; // variável para armazenar o ID da animação

// Função chamada quando a vida da nave chega a zero
function fimDeJogo() {
    window.cancelAnimationFrame(animacaoId);
    clearInterval(intervaloInimigos);

    // Mostra o botão novamente para o jogador poder reiniciar o jogo
    // Troca o texto para indicar que é um reinício, não o primeiro início
    botaoIniciar.textContent = 'Jogar Novamente';
    botaoIniciar.style.display = 'block';
}

// Função de "game loop"
function jogo() {
    // Fiquei em dúvida entre canvas.clienteWidth e canvas.width. Pesquisei e vi que o correto é o segundo pois o primeiro é utilizado para dimensionar o tamanho que o canvas ocupa fisicamente no layout da página.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // atualiza os valores

    // verifica se a vida da nave já zerou. Se sim, para o jogo
    if (nave.vida <= 0) {
        fimDeJogo();

        // ------------------ TELA DE GAME OVER ------------------
        // Mantém o fundo escuro temático em vez do azul claro anterior
        ctx.fillStyle = COR_FUNDO;
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Desenha as estrelas para manter a atmosfera espacial
        desenharEstrelas();

        ctx.font = `${tamanho_fonte_grande}px Arial`;
        ctx.fillStyle = COR_INIMIGO; // Vermelho para reforçar a derrota
        ctx.fillText('GAME OVER', canvas.width / 2 - canvas.width * 0.15, canvas.height * 0.3); // Valor alterado porque o botão "Jogar Novamente" estava sobrepondo ele no centro.

        ctx.font = `${tamanho_fonte_medio}px Arial`;
        ctx.fillStyle = COR_TEXTO;
        ctx.fillText(`Pontuação final: ${pontuacao}`, canvas.width / 2 - canvas.width * 0.15, canvas.height * 0.38);
        return; // para o loop aqui e não agenda o próximo quadro
    };

    atualizarDificuldade();     // Atualiza as velocidades com base no tempo decorrido
    atualizarNave();
    atualizarEstrelas();        // Move as estrelas para criar o efeito de movimento espacial
    atualizarProjeteis();
    atualizarInimigos();
    verificarColisoesProjetil();
    verificarColisaoNave();

    //desenha tudo novamente com os dados atualizados

    // Desenha o fundo escuro espacial
    ctx.fillStyle = COR_FUNDO;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha o campo de estrelas sobre o fundo
    desenharEstrelas();

    // Desenha a zona de perigo na borda esquerda (gradiente vermelho)
    desenharZonaPerigo();

    // Desenha a nave do jogador como um triângulo apontando para a direita
    desenharTrianguloDireita(nave.posicao_x, nave.posicao_y, nave.largura, nave.altura, COR_NAVE);

    // Desenha os projéteis
    projeteis.forEach((projetil) => {
        ctx.fillStyle = projetil.cor;
        ctx.fillRect(projetil.posicao_x, projetil.posicao_y, projetil.largura, projetil.altura);
    })

    // Desenha os inimigos como triângulos apontando para a esquerda
    inimigos.forEach((inimigo) => {
        desenharTrianguloEsquerda(inimigo.posicao_x, inimigo.posicao_y, inimigo.largura, inimigo.altura, inimigo.cor);
    });

    // Desenha o efeito de flash branco se a nave tomou dano recentemente
    desenharFlashDano();

    // Exibe a pontuação na tela com a cor da paleta
    ctx.font = `${tamanho_fonte_normal}px Arial`;
    ctx.fillStyle = COR_TEXTO;
    ctx.fillText(`Pontuação: ${pontuacao}`, (canvas.width / 2) - (canvas.width * 0.08), tamanho_fonte_normal + margem);

    // Exibe a vida da nave do jogador
    ctx.fillStyle = COR_TEXTO;
    ctx.fillText(`Vida: ${nave.vida}`, margem, tamanho_fonte_normal + margem);

    // Informa ao navegador que o código quer fazer uma animação. Dessa forma, ele sincroniza a frequência da animação com a do monitor e otimiza o desempenho. Ele solicita o próximo quadro nesse formato para gerar um loop
    animacaoId = requestAnimationFrame(jogo);
};

// ------------------ CONTROLE DE INÍCIO E REINÍCIO DO JOGO ----------------
// Adicionado para permitir que o jogo só comece quando o jogador clica no botão "Iniciar"

// Função que reseta todas as variáveis do jogo para o estado inicial.
// Necessária para o "Jogar Novamente" após um game over.
function resetarJogo() {
    // Restaura os atributos da nave para os valores iniciais
    nave.posicao_x = 400;
    nave.posicao_y = 10;
    nave.vida = 100;
    nave.velocidade = velocidade_base_nave;

    // Zera a pontuação
    pontuacao = 0;

    // Esvazia as listas de projéteis e inimigos
    projeteis = [];
    inimigos = [];

    // Reseta os controles de tempo (cooldown de tiro e flash de dano)
    tempo_ultimo_disparo = 0;
    tempo_inicio_flash = 0;
}

// Função que efetivamente inicia o jogo (chamada pelo clique no botão)
function iniciarJogo() {
    // Esconde o botão durante o jogo
    botaoIniciar.style.display = 'none';

    // Reseta todas as variáveis para o estado inicial
    resetarJogo();

    // Define o momento atual como início do jogo (usado pelo cálculo de dificuldade)
    tempo_inicio_jogo = Date.now();

    // Inicia o intervalo que cria inimigos a cada 1200ms
    intervaloInimigos = setInterval(criarInimigo, 1200);

    // Inicia o game loop
    jogo();
}

// Adiciona o evento de clique no botão para iniciar/reiniciar o jogo
botaoIniciar.addEventListener('click', iniciarJogo);