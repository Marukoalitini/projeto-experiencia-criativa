const express = require('express'); // isso é so um exemplo, mudar para o projeto atual
const path = require('path');
const app = express();
const port = 3000;
const db = require('./model/db');

// Servir ficheiros estáticos (como o HTML)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Definir uma rota GET
app.get('/api/mensagem', (req, res) => {
  res.json({ mensagem: 'Olá, esta é a resposta da rota!' });
});

app.post('/api/login', async (req, res) => {
  const {email, password} = req.body;
  //console.log(email);
  //console.log(password);
  let resultado = await db.login(email, password);
 // console.log(resultado); 
  res.send(resultado)
});

app.post('/api/cadastrocliente', (req, res) => {
    console.log("Chegou no cadastro cliente");
    const {nome, contato, email, uf, idCidade, rua, numero, bairro, cep} = req.body;
    console.log(nome);
    console.log(contato);
    console.log(email);
    console.log(uf);
    console.log(idCidade);
    console.log(rua);
    console.log(numero);
    console.log(bairro);
    console.log(cep);

    db.cadastrarCliente(nome, contato, email, uf, idCidade, rua, numero, bairro, cep);
    
    res.send(`Nome: ${nome}`);
  });

  app.post('/api/alterarcliente', (req, res) => {
    const {idCliente, nome, contato, email, uf, idCidade, rua, numero, bairro, cep} = req.body;
    
    db.alterarcliente(idCliente, nome, contato, email, uf, idCidade, rua, numero, bairro, cep);
    console.log(idCidade);
    
    res.send(`Nome: ${nome}`);

  });

  app.post('/api/excluircliente', async (req, res) => {
    const {id} = req.body;
    //console.log("Chegou no excluir cliente");
    //console.log(id);

    try {
       await db.excluirCliente(id);
       res.status(200).json({ message: 'Cliente excluido com sucesso!' });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao excluir cliente' });
    } 
  });

  app.post('/api/consultacliente', async (req, res) =>  {
    const { paginaAtual, registrosPorPagina } = req.body;

    let resultado = await db.consultaCliente( paginaAtual, registrosPorPagina ); 
    res.send(resultado);
  });

  app.post('/api/editarcliente', async (req, res) =>  {
    const {id} = req.body;

    let resultado = await db.consultaClientePorId(id); 
    console.log(resultado);
    res.send(resultado);
  });

  app.post('/api/consultacidadeporUF', async (req, res) =>  {
    const {ufSelecionado} = req.body;
    let resultado = await db.consultaCidadeporUF(ufSelecionado);
    //console.log(resultado);
    res.send(resultado);
  });


app.post('/api/cadastroanimal', (req, res) => {
    const {nome, tipo, porte, sexo, cor, obs, idCliente} = req.body;
    /*console.log(nome);
    console.log(tipo);
    console.log(porte);
    console.log(sexo);
    console.log(cor);
    console.log(obs);
    console.log(idCliente);*/
    

    db.cadastrarAnimal(nome, tipo, porte, sexo, cor, obs, idCliente);

    res.send(`Nome: ${nome}`);
});

app.post('/api/consultaanimal', async (req, res) =>  {
  const { paginaAtual, registrosPorPagina } = req.body;

    let resultado = await db.consultaAnimal(paginaAtual, registrosPorPagina ); 
    //console.log(resultado);
    res.send(resultado);
}); 

app.post('/api/consultaanimalpordono', async (req, res) =>  {
  const {clienteSelecionado} = req.body;
  let resultado = await db.consultaAnimalPorDono(clienteSelecionado);
  //console.log(resultado);
  res.send(resultado);
});

app.post('/api/alteraranimal', (req, res) => {
  const {idAnimal, nome, tipo, porte, sexo, cor, obs, idCliente} = req.body;
  
  db.alterarAnimal(idAnimal, nome, tipo, porte, sexo, cor, obs, idCliente);
  
  res.send(`Nome: ${nome}`);
});

app.post('/api/editaranimal', async (req, res) =>  {
  const {id} = req.body;

  let resultado = await db.consultaAnimalPorId(id); 
  //console.log(resultado);
  res.send(resultado);
});

  
app.post('/api/excluiranimal', async (req, res) => {
    const {id} = req.body;
    // console.log("Chegou no excluir animal");
    //console.log(id);
    //console.log("ANTES DE EXCLUIR ANIMAL#####");
    
    try {
       await db.excluirAnimal(id);
       res.status(200).json({ message: 'Animal excluido com sucesso!' });
    } catch (error) {
        return res.status(400).send({ error: 'Erro ao excluir animal' });
    } 
    
    
});  

app.post('/api/cadastrousuario', (req, res) => {
    let {idCliente, username, email, password, tipoUsuario} = req.body;
    //console.log(username);
    //console.log(email);
    //console.log(password);
    //console.log(perfil);
    //console.log('Request body:', req.body);

    if (idCliente === '' || idCliente === undefined) {
      idCliente = null;
    }

    db.cadastrarUsuario(idCliente, username, email, password, tipoUsuario);

    res.send(`Username: ${username}`);
});	    

app.post('/api/consultausuario', async (req, res) =>  {

  const { paginaAtual, registrosPorPagina } = req.body;
  
  let resultado = await db.consultaUsuario( paginaAtual, registrosPorPagina); 
  //console.log(resultado);
  res.send(resultado);
}); 

app.post('/api/excluirusuario', (req, res) => {
  const {id} = req.body;
  //console.log("Chegou no excluir usuario");
  //console.log(id);

  db.excluirUsuario(id);
  
  res.send([]);
});

app.post('/api/alterarusuario', (req, res) => {
  const { username, email, password, tipoUsuario, idCliente, idUsuario } = req.body;
  //console.log("Chegou no ALTERAR AAAAAAAAA");
  
  db.alterarUsuario( username, email, password, tipoUsuario, idCliente, idUsuario);

  res.send('');
});

app.post('/api/editarusuario', async (req, res) =>  {
  const {id} = req.body;

  let resultado = await db.consultaUsuarioPorId(id); 
  //console.log("Chegou no editar usuario");
  //console.log(req.body);
  //console.log(resultado);
  res.send(resultado);
});

app.post('/api/agenda', (req, res) => {  
    const {idAnimal, data, timeInput1, timeInput2, idServico, status, idCliente } = req.body;  
           
    /*console.log(cliente);
    console.log(data);
    console.log(animal);
    console.log(timeInput1);
    console.log(timeInput2);
    console.log(obs);
    console.log(idAnimal);
    console.log(status);
      */
    //console.log("chegou no AGENDA #############################3");     

    db.agendar(idAnimal, data, timeInput1, timeInput2, idServico, status, idCliente );

    res.send(`Cliente: ${idCliente}`);

});    

app.post('/api/consultaagenda', async (req, res ) =>  {
  const { paginaAtual, registrosPorPagina, idCliente } = req.body;
  //console.log(idCliente)
  let resultado = await db.consultaAgenda( paginaAtual, registrosPorPagina, idCliente); 
  //console.log(resultado);
  res.send(resultado);
}); 

app.post('/api/alteraragenda', (req, res) => {
  const {idAgenda, idAnimal, data, timeInput1, timeInput2, idServico, status, idCliente } = req.body;
  
  db.alterarAgenda(idAgenda, idAnimal, data, timeInput1, timeInput2, idServico, status, idCliente);
  
  res.send('');
});

app.post('/api/editaragenda', async (req, res) =>  {
  const {id} = req.body;

  let resultado = await db.consultaAgendaPorId(id); 
  //console.log(resultado);
  res.send(resultado);
});


app.post('/api/excluiragenda', (req, res) => {
  const {id} = req.body;
  //console.log("Chegou no excluir agenda");
  //console.log(id);

  db.excluirAgenda(id);
  
  res.send([]);
});  

app.post('/api/concluiragenda', async (req, res) =>  {
  const {id} = req.body;

  await db.concluirAgenda(id); 
  //console.log(resultado);
  res.send("Agenda concluida com sucesso!");
});

app.post('/api/consultacidade', async (req, res) =>  {

  let resultado = await db.consultaCidade(); 
  //console.log(resultado);
  res.send(resultado);
});

app.post('/api/pesquisartotalregistrosagenda', async (req, res) =>  {
  const {idCliente} = req.body;

  let resultado = await db.consultaTotalRegistrosAgenda( idCliente); 
  res.send(resultado);
});

app.get('/api/pesquisartotalregistroscliente', async (req, res) =>  {

  let resultado = await db.consultaTotalRegistrosCliente(); 
  res.send(resultado);
});

app.post('/api/pesquisartotalregistrosanimal', async (req, res) =>  {

  let resultado = await db.consultaTotalRegistrosAnimal(); 
  res.send(resultado);
});

app.post('/api/pesquisartotalregistrosusuario', async (req, res) =>  {

  let resultado = await db.consultaTotalRegistrosUsuario(); 
  res.send(resultado);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor a correr em http://localhost:${port}`);
});