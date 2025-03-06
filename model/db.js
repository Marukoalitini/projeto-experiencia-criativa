async function connect(){ // mudar para coisas do projeto atual

    if(global.connection && global.connection.state != 'disconnected' ){
        return global.connection;
    }

    const mysql = require('mysql2/promise'); // conexão com o banco de dados
    const connection =  await mysql.createConnection("mysql://root:admin@localhost:3306/bdpetshop");
 

    console.log("Conectou no MYSQL!");
    global.connection = connection;
    
 
    return connection;

}

connect();

async function login(usuario, senha){
    const conn = await connect();
    const sql = "SELECT email, tipoUsuario, idCliente FROM Usuario WHERE email = ? AND senha = ?";

    const values = [usuario, senha];
    let resultado = await conn.query(sql, values);
    return resultado;
}

async function cadastrarCliente(nome, contato, email, uf, idCidade, rua, numero, bairro, cep){    

     const conn = await connect();
     const sql = "INSERT INTO Cliente (nomeCompleto, contato, email, rua, numero, bairro, cep, uf, idCidade) values (?, ?, ?, ?, ?, ?, ?, ?, ?) "; 

     const values = [nome, contato, email, rua, numero, bairro, cep, uf, idCidade];
     //console.log(sql, values);
     let resultado = await conn.query(sql, values).then(() => {
                               console.log('Cadastro realizado com sucesso!');
     }).catch((error) => {
                               console.error('Erro ao executar cadastro:', error);
                       });
}

async function alterarcliente(idCliente, nome, contato, email, uf, idCidade, rua, numero, bairro, cep){    

    const conn = await connect();
    const sql = "UPDATE Cliente SET nomeCompleto = ? , contato  = ? , email = ? , rua = ? , numero = ? , bairro = ? , cep = ? , uf = ? , idCidade = ? WHERE id = ? "; 

    const values = [nome, contato, email, rua, numero, bairro, cep, uf, idCidade, idCliente];
    console.log(sql, values);
    await conn.execute(sql, values);
}

async function consultaCliente(paginaAtual, registrosPorPagina){    

    const conn = await connect();
    let sql = `
                SELECT 
                    c.id AS id, 
                    c.nomeCompleto AS nomeCompleto, 
                    c.contato AS contato, 
                    c.email AS email, 
                    c.rua AS rua, 
                    c.numero AS numero, 
                    c.bairro AS bairro, 
                    c.cep AS cep, 
                    c.uf AS uf, 
                    ci.id AS idCidade, 
                    ci.nomeCidade AS nomeCidade 
                FROM 
                    Cliente c, 
                    cidade ci 
                WHERE 
                    c.idCidade = ci.id 
                    
                ORDER BY 
                    TRIM(c.nomeCompleto) ASC`;    ;

        let values = [];            
        if (paginaAtual != null && registrosPorPagina != null) {
            sql += ' LIMIT ? OFFSET ?';
            values = [registrosPorPagina, paginaAtual];
        }        

    let resultado = await conn.query(sql, values);
    //console.log(paginaAtual);''
    //console.log(registrosPorPagina);
    return resultado;
}

async function consultaClientePorId(id){
    const conn = await connect();
    const sql = 
                ' SELECT ' + 
                '    c.id AS id, ' + 
                '    c.nomeCompleto AS nomeCompleto, ' +
                '    c.contato AS contato, ' +
                '    c.email AS email, ' +
                '    c.rua AS rua, ' +
                '    c.numero AS numero, ' +
                '    c.bairro AS bairro, ' +
                '    c.cep AS cep, ' +
                '    c.uf AS uf, ' +
                '    ci.id AS idCidade, ' +
                '    ci.nomeCidade AS nomeCidade ' +
                ' FROM ' +
                '    Cliente c, ' +                 
                '    cidade ci ' +
                ' WHERE ' +
                '    c.idCidade = ci.id AND c.id = ? ' +
                'ORDER BY' +
                '    c.nomeCompleto ASC'; 

    let resultado = await conn.query(sql, [id]);
    return resultado;
}

async function excluirCliente(id){    

    try {
        const conn = await connect();
        const sql = "DELETE FROM Cliente WHERE id = ?"; 

        const values = [id];
        //console.log(sql, values);
        await conn.execute(sql, values);                    
    } catch (error) {
        console.log('ERRO DO SQL:', error.errno);
        throw error;
    }
}   

async function consultaCidadeporUF(ufSelecionado){
    const conn = await connect();
    const sql = "SELECT * FROM Cidade WHERE uf = ?";

    const values = [ufSelecionado];
    let resultado = await conn.query(sql, values);
    return resultado;
}

async function cadastrarAnimal(nome, tipo, porte, sexo, cor, obs, idCliente){

    const conn = await connect();
    const sql = "INSERT INTO Animal (nome, tipo, porte, sexo, cor, observacoes, idCliente) values (?, ?, ?, ?, ?, ?, ?) ";

    const values = [nome, tipo, porte, sexo, cor, obs, idCliente];
    //console.log(sql, values);
    let resultado = await conn.query(sql, values).then(() => {
                              console.log('Cadastro realizado com sucesso!');
    }).catch((error) => {
                              console.error('Erro ao executar cadastro:', error);
                      });
}  

async function consultaAnimal(paginaAtual, registrosPorPagina){    

    const conn = await connect();
    let sql = `
                SELECT 
                    a.id AS id, 
                    a.nome AS nomeAnimal,
                    a.tipo AS tipo,
                    a.porte AS porte,
                    a.sexo AS sexo,
                    a.cor AS cor,
                    a.observacoes AS observacoes,
                    c.id AS idCliente,
                    c.nomeCompleto AS nomeCliente
                FROM 
                    Animal a,
                    Cliente c 
                WHERE
                    a.idCliente = c.id
                ORDER BY 
                    TRIM(c.nomeCompleto) ASC`;
                
    let values = [];

    if (paginaAtual != null&& registrosPorPagina != null) {
        sql += ' LIMIT ? OFFSET ?';
        values = [registrosPorPagina, paginaAtual];
    } 

    let resultado = await conn.query(sql, values);

    //console.log("consultaAnimal");   
    //console.log(resultado);
    return resultado;
}

async function consultaAnimalPorId(id){
    const conn = await connect();
    const sql = `
                SELECT 
                    a.id AS id, 
                    a.nome AS nomeAnimal,
                    a.tipo AS tipo,
                    a.porte AS porte,
                    a.sexo AS sexo,
                    a.cor AS cor,
                    a.observacoes AS observacoes,
                    c.id AS idCliente,
                    c.nomeCompleto AS nomeCliente
                FROM 
                    Animal a,
                    Cliente c 
                WHERE
                    a.idCliente = c.id
                    AND a.id = ?
                `;
    let resultado = await conn.query(sql, [id]);
    return resultado;
}

async function consultaAnimalPorDono(clienteSelecionado){
    const conn = await connect();
    const sql = "SELECT * FROM Animal WHERE idCliente = ?";

    const values = [clienteSelecionado];
    let resultado = await conn.query(sql, values);
    return resultado;
}


async function excluirAnimal(id){    
   
    try {
        const conn = await connect();
        const sql = "DELETE FROM Animal WHERE id = ?"; 

        const values = [id];
        //console.log(sql, values);
        await conn.execute(sql, values);                    
    } catch (error) {
        console.log('ERRO DO SQL####:', error.errno);
        throw error;
    }
}

async function alterarAnimal(idAnimal, nome, tipo, porte, sexo, cor, obs, idCliente){    

    const conn = await connect();
    const sql = "UPDATE Animal SET nome = ? , tipo = ? , porte = ? , sexo = ? , cor = ? , observacoes = ? , idCliente = ? WHERE id = ? "; 

    const values = [nome, tipo, porte, sexo, cor, obs, idCliente, idAnimal]; // esse precisa seguir a ordem igual na tabela
    //console.log(sql, values);
    //console.log(sexo);
    await conn.execute(sql, values);
}

async function cadastrarUsuario(idCliente, username, email, password, tipoUsuario){
    
        const conn = await connect();
        const sql = "INSERT INTO Usuario (nomeCompleto, email, senha, tipoUsuario, idCliente) values (?, ?, ?, ?, ?) ";
    
        const values = [username, email, password, tipoUsuario, idCliente];
        //console.log(sql, values);
        let resultado = await conn.query(sql, values).then(() => {
                                console.log('Cadastro realizado com sucesso!');
        }).catch((error) => {
                                console.error('Erro ao executar cadastro:', error);
                        });
}

async function consultaUsuario(paginaAtual, registrosPorPagina){    

    const conn = await connect();
    let sql = `
                SELECT 
                    u.id AS id,
                    u.nomeCompleto AS nomeCompleto, 
                    u.email AS email,
                    u.senha AS senha,
                    u.tipoUsuario AS tipoUsuario,
                    c.id AS idCliente
                FROM 
                    Usuario u
                LEFT JOIN 
                    Cliente c ON u.idCliente = c.id
                ORDER BY 
                    TRIM(u.nomeCompleto) ASC`;

                let values = [];

                if (paginaAtual != null&& registrosPorPagina != null) {
                    sql += ' LIMIT ? OFFSET ?';
                    values = [registrosPorPagina, paginaAtual];
                } 

    let resultado = await conn.query(sql, values);
    return resultado;
}

async function consultaUsuarioPorId(id){
    const conn = await connect();
    const sql = `
                SELECT 
                    u.id AS id, 
                    u.nomeCompleto AS nomeCompleto, 
                    u.email AS email,
                    u.senha AS senha,
                    u.tipoUsuario AS tipoUsuario,
                    c.id AS idCliente
                FROM 
                    Usuario u
                LEFT JOIN 
                    Cliente c ON u.idCliente = c.id
                WHERE 
                    u.id = ?;
                `;

    let resultado = await conn.query(sql, [id]);
    return resultado;
}    

async function alterarUsuario(username, email, password, tipoUsuario, idCliente, idUsuario){    

    const conn = await connect();
    idCliente = idCliente || null;

    const sql = "UPDATE Usuario SET nomeCompleto = ? , email = ? , senha = ?, tipoUsuario = ? , idCliente = ? WHERE id = ? "; 

    const values = [username, email, password, tipoUsuario, idCliente, idUsuario]; // esse precisa seguir a ordem igual na tabela
    //console.log(sql, values);
    await conn.execute(sql, values);
}

async function excluirUsuario(id){    

    try {
        const conn = await connect();
        const sql = "DELETE FROM Usuario WHERE id = ?"; 

        const values = [id];
        //console.log(sql, values);
        await conn.execute(sql, values);                    
    } catch (error) {
        //console.log('ERRO DO SQL####:', error.errno);
        throw error;
    }
}

async function agendar (idAnimal, data, timeInput1, timeInput2, idServico, status ){
                         
        const conn = await connect();
        const sql = "INSERT INTO Agendar (idAnimal, dataAgenda, horarioInicio, horarioFim, idServico, status) values (?, ?, ?, ?, ?, ?) ";

        const values = [idAnimal, data, timeInput1, timeInput2, idServico, status ]; 
        //console.log("antes DE EXECUTAR O CHEGOU NO AGENDA #############################3");
       // console.log(sql, values);
        let resultado = await conn.query(sql, values).then(() => {
                                console.log('Cadastro realizado com sucesso!');
        }).catch((error) => {
                                console.error('Erro ao executar cadastro:', error);
                        });
} 

async function consultaAgenda( paginaAtual, registrosPorPagina, idCliente){    
    //console.log("Chegou no consultaAgenda");

    const conn = await connect();
    let sql = `
                SELECT 
                    g.id AS id, 
                    a.id AS idAnimal,
                    a.nome AS nomeAnimal,
                    DATE_FORMAT(g.dataAgenda, '%d/%m/%Y') AS dataAgenda,
                    TIME_FORMAT(g.horarioInicio, '%H:%i') AS horarioInicio,
                    TIME_FORMAT(g.horarioFim, '%H:%i') AS horarioFim,
                    g.status AS status,
                    c.id AS idCliente,
                    c.nomeCompleto AS nomeCliente,
                    g.idServico AS idServico
                FROM 
                    Agendar g, 
                    Animal a, 
                    Cliente c  
                WHERE 
                    g.idAnimal = a.id 
                    AND a.idCliente = c.id
                `;

                let values = [];

                if(idCliente!=null&&idCliente!=''){
                    sql += ' AND c.id = ? ';
                }
                sql += ' ORDER BY g.dataAgenda, g.horarioInicio ';
                if(paginaAtual!=null&& registrosPorPagina!=null){
                    sql += ' LIMIT ? OFFSET ? ';
                    if(idCliente!=null){
                        values = [idCliente, registrosPorPagina, paginaAtual];
                    } else {
                        values = [registrosPorPagina, paginaAtual];
                    }                        
                } else if(idCliente!=null&&idCliente!=''){
                    values = [idCliente];
                }

                //console.log(sql, values);

                

    let resultado = await conn.query(sql, values );
    //console.log(paginaAtual);
    //console.log(registrosPorPagina);
    return resultado;
}

async function consultaAgendaPorId(id){
    const conn = await connect();
    const sql = `
                SELECT 
                    g.id AS id, 
                    a.id AS idAnimal,
                    a.nome AS nomeAnimal,
                    DATE_FORMAT (g.dataAgenda, '%Y-%m-%d') AS dataAgenda,
                    g.horarioInicio AS horarioInicio,
                    g.horarioFim AS horarioFim,
                    g.status AS status,
                    c.id AS idCliente,
                    c.nomeCompleto AS nomeCliente,
                    g.idServico AS idServico
                FROM 
                    Agendar g, 
                    Animal a, 
                    Cliente c  
                WHERE 
                    g.idAnimal = a.id 
                    AND a.idCliente = c.id
                    AND g.id = ?
                `;
    let resultado = await conn.query(sql, [id]);

    return resultado;
}

async function alterarAgenda(idAgenda, idAnimal, data, timeInput1, timeInput2, idServico, status,){    

    const conn = await connect();
    const sql = "UPDATE Agendar SET idAnimal = ? , dataAgenda = ? , horarioInicio = ? , horarioFim = ? , idServico = ? , status = ? WHERE id = ? "; 

    const values = [idAnimal, data, timeInput1, timeInput2, idServico, status, idAgenda]; // esse precisa seguir a ordem igual na tabela
    //console.log(sql, values);
    await conn.execute(sql, values);
}

async function excluirAgenda(id){    

    const conn = await connect();
    const sql = "DELETE FROM Agendar WHERE id = ?"; 

    const values = [id];
    //console.log(sql, values);
    await conn.execute(sql, values).then(() => {
                              console.log('Excluido com sucesso!');
    }).catch((error) => {
                              console.error('Erro ao excluir:', error);
                      });
}

async function concluirAgenda(id){
    const conn = await connect();
    const sql = "UPDATE Agendar SET status = 'Concluido' WHERE id = ? "; 

    const values = [id];
   // console.log(sql, values);
    await conn.execute(sql, values);
}

async function consultaTotalRegistrosAgenda(idCliente){
    const conn = await connect();
    let sql = "SELECT COUNT(ag.id) AS total FROM Agendar ag, Animal an WHERE ag.idAnimal = an.id  "; 

    let values = [];
    if (idCliente != null && idCliente != '') {
        sql += ' AND an.idCliente = ? ';
        values = [idCliente];
    }

    let resultado = await conn.query(sql, values);
    return resultado;
}

async function consultaTotalRegistrosCliente(){
    const conn = await connect();
    const sql = "SELECT COUNT(*) AS total FROM Cliente";

    let resultado = await conn.query(sql, []);
    return resultado;
}

async function consultaTotalRegistrosAnimal(){
    const conn = await connect();
    const sql = "SELECT COUNT(*) AS total FROM Animal";

    let resultado = await conn.query(sql, []);
    return resultado;
}

async function consultaTotalRegistrosUsuario(){
    const conn = await connect();
    const sql = "SELECT COUNT(*) AS total FROM Usuario";

    let resultado = await conn.query(sql, []);
    return resultado;
}

async function consultaCidade(){    

    const conn = await connect();
    const sql = "SELECT * FROM Cidade";

    let resultado = await conn.query(sql, []);

    //console.log("consultaCidade");   
   // console.log(resultado);
    return resultado;
}

module.exports = {cadastrarCliente,
                  alterarcliente,
                  consultaCliente, 
                  excluirCliente,
                  consultaClientePorId,
                  consultaCidadeporUF,
                  cadastrarAnimal,
                  consultaAnimal,
                  excluirAnimal,
                  alterarAnimal,
                  consultaAnimalPorId,
                  consultaAnimalPorDono,
                  cadastrarUsuario,
                  consultaUsuario,
                  consultaUsuarioPorId,
                  alterarUsuario,
                  excluirUsuario,
                  agendar,
                  consultaAgenda,
                  consultaAgendaPorId,
                  alterarAgenda,
                  excluirAgenda,
                  concluirAgenda,
                  consultaTotalRegistrosAgenda,
                  consultaTotalRegistrosCliente,
                  consultaTotalRegistrosAnimal,
                  consultaTotalRegistrosUsuario,
                  consultaCidade,
                  login
};