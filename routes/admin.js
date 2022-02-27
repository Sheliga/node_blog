const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

require("../models/Postagens")
const Postagem = mongoose.model("postagens")

router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Página de posts")
})

router.get("/categorias", (req, res) => {
    Categoria.find().sort({date:"desc"}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", (req, res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({text: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({text: "Slug inválido"})
    }
    if(req.body.nome > 2 ){
        erros.push({text: "Texto da categoria é muito pequeno."})
    }
    
    if(erros.length > 0){
         // Filtrando os dados antes de mandar para View
         console.log(erros)
         const context = {
            errosContext: erros.map(erro  =>  {
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
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg","categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg","Houve um erro ao salvar a categoria")
            console.log("erro ao salvar categoria: "+err)
            res.redirect("/admin")
        })
        
    }
  
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("admin/categoria")
    })
    
})
router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({_id:req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria!")
        })

    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", (req, res) => {
    Categoria.deleteOne({_id:req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias") 
    })
})

router.get("/postagens",(req, res) =>{
    Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
        res.render("admin/postagens", {postagens:postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        console.log("postagens")
        res.redirect("/admin")
    })
    
})

router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias:categorias})
    }).catch((err) => {
        
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
    
})

router.post("/postagens/nova/", (req, res) =>  {
    erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "categoria inválida, registre uma categoria"})
    }
    if(erros.length > 0 ){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        console.log(req.body.titulo)
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }
        new Postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            console.log(err)
            console.log(novaPostagem)
            req.flash("error_msg", "Houve um erro durante o salvamento das postagens")
            res.redirect("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", (req, res) =>  {
    Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias:categorias, postagem: postagem})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })
        
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulario de edição")
        res.redirect("/admin/postagens")
    })
    
})

router.post("/postagens/edit/", (req, res) =>{
    erros = []

    Postagem.findOne({_id:req.body.id}).then((postagem) => {
        
            postagem.titulo = req.body.titulo
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
            postagem.slug = req.body.slug

            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                
                req.flash("error_msg", "Erro intero")
                res.redirect("/admin/postagens")
            })
        
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao salvar a edição")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/deletar/:id", (req, res) =>  {
    //Forma menos segura do q a utilizada com formularios para remover 
    //categorias, está aqui como objeto de estudo pra saber q ela existe    
    Postagem.remove({_id: req.params.id}).then(() => {
        res.redirect("/admin/postagens")
    }) 
})

module.exports = router