require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Testa a conexão inicial com o banco
async function testConnection() {
    try {
        const client = await pool.connect();
        await client.query(`SET search_path TO ${process.env.DB_SCHEMA}`); // Define o schema
        const res = await client.query("SELECT * FROM users"); // Testa consulta na tabela
        console.log(res.rows);
        client.release();
    } catch (err) {
        console.error("Erro ao conectar ao banco:", err);
    }
}

testConnection();

// Middleware para permitir JSON no body
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.send("Servidor Express com PostgreSQL!");
});

// Rota para buscar usuários do banco
app.get("/users", async (req, res) => {
    try {
        const client = await pool.connect(); // Conecta ao banco
        await client.query(`SET search_path TO ${process.env.DB_SCHEMA}`); // Define o schema
        const result = await client.query("SELECT * FROM users"); // Busca os usuários
        client.release(); // Libera a conexão
        res.json(result.rows);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).send("Erro no servidor");
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
