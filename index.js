const readline = require('readline');
const actions = require('./actions');

const _ = new actions();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function start() {
    try {
        rl.question('Digite o caminho do arquivo de votação: ', async (path) => {
            try {
                const dados = require(path);

                await _.contaVotos(dados.candidates, dados.votes, dados.totalVotes);
                
                
                console.log('------------------------------------');
                console.log('Contagem de votos encerrada');
                console.log('------------------------------------ \n');
                
                
                try {
                    await _.buscaResultados();
                    
                } catch (e) {
                    console.error('Ocorreu um erro ao buscar a contagem de votos:', e);
                }
                
                rl.close();
                
            } catch (e) {
                console.error(e);
                console.log('Não foi possível encontrar o arquivo de armazenamento de votos. Por favor, tente novamente. \n');
                rl.close();
            }
        });
        
    } catch (e) {
        console.log('Ecorreu um erro ao salvar as informações no banco de dados');
        console.error(e);
    }
}


start();