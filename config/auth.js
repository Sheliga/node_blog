const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de usuario
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")


module.exports = (passport) =>{
    passport.use(new localStrategy({usernameField: 'email'}, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) =>{
            if(!usuario){
                return done(null, false, {message: "Esta conexão não existe"})
            }
            bcrypt.compare(senha, usuario.senha, (erro, compativel) =>{
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "credenciais inválidas"})
                }
            })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUSer((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}
