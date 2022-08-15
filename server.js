 // cofigurando o servidor
 const express = require("express")
 const server = express()

 //configurar o servidor para apreseentar arquivos staticos
 server.use(express.static('public'))

 //habilitar body do formulario
 server.use(express.urlencoded({ extended: true }))

 //configurar a conexão co banco de dados
 const Pool = require('pg').Pool
 const db = new Pool({
     user: 'postgres',
     password: '2201024ever',
     host: 'localhost',
     port: 5432,
     database: 'doe',
 })

 //configurando a templete engine
 const nunjucks = require("nunjucks")
 nunjucks.configure("./", {
     express: server,
     noCache: true, //booblean aceita 2 valores verdadeiro ou falso
 })


 // confugurar a apresentação da página
 server.get("/", function(req, res) {
     db.query("select * from donors", function(err, result) {
         if (err) return res.send("erro de banco de dados.")

         const donors = result.rows;
         return res.render("index.html", { donors })

     })

 })

 server.post("/", function(req, res) {
     //pegar dados do formulario
     const name = req.body.name
     const email = req.body.email
     const blood = req.body.blood

     //se o nome for igual a vazio
     //OU o email for igual a vazio
     //OU o blood for igual a vazio
     if (name == "" || email == "" || blood == "") {
         return res.send("Todos os campos são Obrigatórios.")
     }

     //coloco valores dentro do banco de dados
     const query = `
        insert into donors ("name", "email", "blood") 
        values ($1, $2, $3)`

     const values = [name, email, blood]

     //fluxo de erro
     db.query(query, values, function(err) {
         if (err) return res.send("erro no banco de dados")

         //fluxo ideal
         return res.redirect("/")
     })

 })

 // ligar o servidor e permitir o acesso na porta 3000
 server.listen(3000, function() {
     console.log("iniciei o servidor.")
 })