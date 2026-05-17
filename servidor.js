// Importa o módulo Express, que facilita a criação de servidores web em Node.js.
// O Express foi instalado via npm (npm install express) e é o framework apresentado nas aulas.
const express = require('express');
 
// Cria uma instância da aplicação Express
const app = express();
 
// Define a porta em que o servidor irá escutar as requisições.
// 3000 é um valor comum para desenvolvimento local.
const porta = 3000;
 
// Configura o Express para servir arquivos estáticos a partir da pasta atual.
// "__dirname" é uma variável global do Node.js que representa o caminho absoluto da pasta atual.
// Com isso, os arquivos HTML, CSS, JS e imagens ficam acessíveis automaticamente pelo navegador.
// Exemplo: http://localhost:3000/index.html, http://localhost:3000/css/estilos.css
app.use(express.static(__dirname));
 
// Rota raiz: quando o navegador acessa http://localhost:3000/, retorna a página principal.
// O método sendFile envia diretamente o arquivo index.html como resposta.
app.get('/', (requisicao, resposta) => {
    resposta.sendFile(__dirname + '/index.html');
});
 
// Inicia o servidor na porta definida.
// A função de callback é executada quando o servidor está pronto para receber conexões.
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
    console.log('Pressione Ctrl+C para encerrar.');
});