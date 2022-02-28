//carregando modulos
    const express = require("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require("body-parser")
    const app = express()
    const admin = require("./routes/admin")
    const path = require('path')
    const mongoose = require("mongoose")
    const session = require("express-session")
    const flash = require("connect-flash")
    
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")



//Configurações
    //Sessão
        app.use(session({
            secret: "node",
            resave:true,
            saveUninitialized:true
        }))
        app.use(flash())
    //middleware
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg") //variavel global
            res.locals.error_msg = req.flash("error_msg") //variavel global
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended:true})) 
        app.use(bodyParser.json()) 
    //Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout:'main'})) 
        app.set('view engine', 'handlebars')
    //Mongoose
        mongoose.connect("mongodb://localhost/blogapp").then(()=>{
            console.log("conectado ao mongodb")
        }).catch((err)=>{
            console.log("erro ao se conectar"+ err)
        })
    //Public
        app.use(express.static(path.join(__dirname,"/public")))
//Rotas
    app.get('/', (req, res)=> {
        Postagem.find().populate("categoria").sort({data:"desc"}).lean().then((postagens)=>{
            res.render("index", {postagens:postagens})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
      
    })
    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })
    app.get('/posts', (req, res) => {
        res.send("Lista Posts")
    })
    app.use('/admin', admin)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("servidor rodando")
})