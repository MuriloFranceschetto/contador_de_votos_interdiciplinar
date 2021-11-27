
const USER = 'postgres';
const PASS = '123456';
const HOST = 'localhost';
const PORT = '5432';
const NAME = 'CONTAGEM';

class db {

    async insertCandadate(conn, id, name, numero) {
        await conn.query('insert into candidatos (id, name, numero) values ($1, $2, $3)', [id, name, numero]);
    }
    
    async insertVotoBranco(conn, idUrna) {
        await conn.query('insert into votos (candidato, branco, urna) values ($1, $2, $3)', [null, true, idUrna]);
    }

    async insertVoto(conn, idCandidato, idUrna) {
        await conn.query('insert into votos (candidato, branco, urna) values ($1, $2, $3)', [idCandidato, false, idUrna]);
    }

    async getTotalVotos(conn) {
        let srcVotos = await conn.query('select sum(id) as total from votos');
        return srcVotos.rows[0].total;
    }

    async getVotos(conn) {
        let src = await conn.query(`select
                                        'Em Branco' as nome_candidato,
                                        sum(v.id) as votos
                                    from votos v
                                    where v.branco is not null
                                    
                                    UNION 
                                    
                                    select
                                        c.name as nome_candidato,
                                        sum(v.id) as votos
                                    from votos v
                                    left join candidatos c on c.id = v.candidato
                                    group by 1`);
        return src.rows;
    }

    async connect() {
        if (global.connection) {
            return global.connection.connect();
        }
    
        const {Pool} = require('pg');
        const pool = new Pool({
            connectionString: `postgres://${USER}:${PASS}@${HOST}:${PORT}/${NAME}`
        });
    
        //apenas testando a conexão
        const client = await pool.connect();
        client.release();
    
        //guardando para usar sempre o mesmo
        global.connection = pool;
        return pool.connect();
    }

}


module.exports = db;