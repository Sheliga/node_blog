const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")    
})

router.post("/registro", (req, res) => {
    var erros = []

    console.log(req.body)
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email Inválido"})
    }
    
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "senha Inválido"})
    }

    if(req.body.senha < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "Senhas não são iguais"})
    }
    
    if(erros.length > 0){
        res.render("usuarios/registro", {erros:erros})

    }else{
        Usuario.findOne({email:req.body.email}).then((usuario) => {
             if(usuario){
                 req.flash("error_msg", "Já existe uma conta associada a esse email no sistema")
                 res.redirect("/usuarios/registro")
             }else{
                 const novoUsuario = new Usuario({
                     nome: req.body.nome,
                     email:req.body.email,
                     senha:req.body.senha
                 })

                 bcrypt.genSalt(10, (erro, salt) => {
                     bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                         if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                         }
                         novoUsuario.senha = hash

                         novoUsuario.save().then(() =>{
                             req.flash("success_msg", "usuario criado com sucesso")
                             res.redirect("/")
                         }).catch((err) => {
                             req.flash("error_msg", "houve um erro ao criar o usuario, tente novamento")
                             res.redirect("/usuarios/registro")
                         })
                     })
                 })
             }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }


})


module.exports = router