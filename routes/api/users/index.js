const express = require("express");
let router = express.Router();

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

module.exports = router;