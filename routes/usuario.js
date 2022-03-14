const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

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

    }


})


module.exports = router