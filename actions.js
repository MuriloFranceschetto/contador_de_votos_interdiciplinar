const db = require('./db');
const database = new db();

class Actions {
    
    async contaVotos(candidatos, votos, total) {
        
        let conn;

        try {
            conn = await database.connect();
            
            for (let candidate of candidatos) {
                try {
                    await database.insertCandadate(conn, candidate.id, candidate.name, candidate.number);
                } catch (e) {
                    console.error(`Candidato ${candidate.name} já existe`);
                }
            };
            
            console.log('------------------------------------');
            console.log('Iniciando contagem de votos');
            console.log('------------------------------------');
            
            for (let i = 0; i < votos.length; i++) {
                
                console.log(`Contabilizando voto ${i + 1} de ${total}`);
                let vote = votos[i];
                
                if (vote.isValid) {
                    
                    if (vote.isBlank) {
                        await database.insertVotoBranco(conn, vote.machineId);
                    }
                    
                    if (vote.candidate) {
                        await database.insertVoto(conn, vote.candidate.id, vote.machineId);
                    }
                }
                
            }
            
        } catch (e) {
            console.error('Ocorreu um erro ao inserir votos:', e);
        
        } finally {
            if (conn) {
                await conn.end();
            }
        }
    }
    
    async buscaResultados(conn) {
    
        let connection;

        try {
            console.log('Resultados:');

            connection = await database.connect();

            let todosOsVotos = await database.getTotalVotos(connection);
            console.log('TOTAL DE VOTOS: ' + todosOsVotos);
            
            let resultado = await database.getVotos(connection);
            
            let candidatoElejido = null;
            for (let res of resultado) {
                if (!candidatoElejido || candidatoElejido.votos < res.votos) {
                    candidatoElejido = res;
                }
            }

            console.log('------------------------------------------------------');
            console.log(`CANDIDATO ELEJIDO: ${candidatoElejido.nome_candidato} COM ${candidatoElejido.votos} VOTOS`);
            console.log('------------------------------------------------------');

            
        } catch (e) {
            console.error('Ocorreu um erro ao contabilizar os votos:', e);
        
        } finally {
            if (connection) {
                await connection.end();
            }
        }


        
    }
    
    getBiggestName(candidatos) {
        return candidatos.reduce((a, b) => Math.max(a.nomeCandidato.length, b.nomeCandidato.length)) + 10;
    }
    
}

module.exports = Actions;