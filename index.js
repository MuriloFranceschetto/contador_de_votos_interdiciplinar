const readline = require('readline');
const db = require("./db");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getVotos() {
    try {
        rl.question('Digite o caminho do arquivo de votação: ', (path) => {
            try {
                const votos = require(path);
                console.log(votos);

                votos.forEach((voto) => {
                    if (voto.isValid) {
                        
                    }
                });


            } catch (e) {
                console.log('Não foi possível encontrar o arquivo de armazenamento de votos. Por favor, tente novamente. \n');
                getVotos();
            }
        });

    } catch (e) {
    }
}

async function connect() {
    if (global.connection) {
        return global.connection.connect();
    }

    const {Pool} = require('pg');
    const pool = new Pool({
        connectionString: 'postgres://fyazuind:r34WG7VcdfJvN4WplbWYHEk-hfyYELv1@isilo.db.elephantsql.com:5432/fyazuind'
    });

    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();

    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}

getVotos();