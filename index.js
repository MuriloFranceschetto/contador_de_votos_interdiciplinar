const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getVotos() {
    try {
        rl.question('Digite o caminho do arquivo de votação: ', (path) => {
            try {
                const votos = require(path);

            } catch (e) {
                console.log('Não foi possível encontrar o arquivo de armazenamento de votos. Por favor, tente novamente. \n');
                getVotos()
            }
        });

    } catch (e) {
    }
}

getVotos();