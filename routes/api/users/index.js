const {v4: uuidv4, v4} = require('uuid');

const express = require("express");
let router = express.Router();
//Mailer
const mailSender = require('../../../utility/mailer');

//User modeles
let userModelClass = require('./users.model.js');
let userModel = new userModelClass();

//Login
const jsonWebToken = require('jsonwebtoken')

router.post('/login', async (req, res, next)=>{
    try {
        const{email, password} = req.body;
        let userLogged = await userModel.getByEmail(email);
        if (userLogged) {
            const isPasswordOk = await userModel.comparePassword(password, userLogged.password);
            if (isPasswordOk) {
                // podemos validar la vigencia de la contraseña
                delete userLogged.password;
                delete userLogged.oldpasswords;
                delete userLogged.lastlogin;
                delete userLogged.lastpasswordchange;
                delete userLogged.passwordexpires;

                //
                let payload ={
                    jsonWebToken: jsonWebToken.sign(
                        {
                            email: userLogged.email,
                            _id: userLogged._id,
                            roles: userLogged.roles
                        },
                        process.env.JWT_SECRET,
                        {expiresIn:'1d'}
                    ),
                    user: userLogged
                };
                return res.status(200).json(payload);
            }
        }
        console.log({email, userLogged});
        return res.status(400).json({msg: "Credenciales no validas"})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Error"})
    }
});

//Crear cuenta
router.post('/signin', async(req, res, next)=>{
    try {
        const {email, password} = req.body;
        let userAdded = await userModel.createNewUser(email, password);
        delete userAdded.password;
        console.log(userAdded);

        res.status(200).json({"msg":"Usuario creado satisfactoriamente"});
    } catch (error) {
        res.status(500).json({"msg":"Error"+error})
    }
})

router.get('/', (req, res, nex)=>{
    res.status(200).json({msg:"Users index"})
})

//Password Recovery
router.post('/forgotpassword', async (req, res)=>{
    try {
        const {email} = req.body;
        //Generar UUID
        let uniqueId = v4();
        let insertTheUiid = await userModel.insertUuid(email, uniqueId)
        console.log(insertTheUiid);

        //Envio del corre
        mailSender(
            email,
            "Recuperacion de contraseña",
            `<a>http://localhost:3000/api/users/resetpassword/${uniqueId}</a>`
        )
        res.status(200).json({"msg":"Se envio un correo"});
    } catch (erro) {
        res.status(500).json({"msg":"Error al solicitar cambio de contraseña" +erro});
    }  
})

router.post('/resetpassword/:id', async (req, res)=>{
    try {
        const {id}=req.params;
        const {newPassword} = req.body;

        const updatePassword = await userModel.changeThePassword(id, newPassword);
        console.log(updatePassword);
        res.status(200).json({msg: "Se cambio la contraseña."})

    } catch (erro) {
        res.status(500).json({"msg":"Error al cambio de contraseña" +erro});
    }

})


module.exports = router;