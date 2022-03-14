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
    
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    
    require("./models/Postagens")
    const Postagem = mongoose.model("postagens")
    
    const usuarios = require("./routes/usuario")



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

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug:req.params.slug}).lean().then( (postagem) =>{
            if(postagem){
                res.render("postagem/index", {postagem:postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existem")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    })

    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) =>{
            res.render("categorias/index", {categorias:categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.redirect("/")
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug:req.params.slug}).lean().then((categoria) =>{
            if(categoria){
                Postagem.find({categoria:categoria._id}).lean().then((postagens) => {
                    res.render("categorias/postagens", {postagens:postagens, categoria:categoria})
                })
            }else{
                req.flash("error_msg","Houve um erro interno ao listar as categorias")
                res.redirect("/")
            }
        }).catch((err) => {
            req.flash("error_msg",  "Esta categorias não existe")
            res.redirect("/")
        })
    })
    

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })
    
    app.use('/admin', admin)
    app.use('/usuarios', usuarios)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("servidor rodando")
})