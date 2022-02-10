const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

router.get("/", (req, res)=>{
    res.render("admin/index")
})

router.get("/posts", (req, res)=>{
    res.send("Página de posts")
})

router.get("/categorias", (req, res)=>{
    res.render("admin/categorias")
})

router.get("/categorias/add", (req, res)=>{
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res)=>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }
    if(req.body.nome < 2 ){
        erros.push({text: "Texto da categoria é muito pequeno."})
    }
    
    if(erros.length > 0){
         // Filtrando os dados antes de mandar para View
         console.log(erros)
         const context = {
            errosContext: erros.map(erro => {
                return {
                    text: erro.text
                }
            })
        }
        res.render("admin/addcategorias", {erros: context.errosContext})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
    
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao salvar a categoria")
            console.log("erro ao salvar categoria: "+err)
        })
        
    }
  
})

module.exports = router