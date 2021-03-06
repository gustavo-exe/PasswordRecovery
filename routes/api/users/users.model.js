var conexion = require('../../../utility/dao');
const bcrypt = require('bcryptjs');
var _db;

class Users{
    secColl = null;
    constructor() {
        this.initModel();
    }

    async initModel(){
        try {
            _db = await conexion.GetBaseDeDatos();
            this.secColl = await _db.collection("users");
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }

    async createNewUser(email, password){
        try {
            let user = {
                email: email,
                password: await bcrypt.hash(password,10),
                lastLogin: null,
                lastPasswordChange: null,
                passwordExpire: new Date().getTime() + (90 * 24 * 60 * 60 * 1000),
                oldPasswords: [],
                roles:["public"]
            }

            let result = await this.secColl.insertOne(user);
            return result;
        } catch (error) {
            console.log(error);
            throw(error);
        }
    }

    async getByEmail(email){
        const filter ={"email": email};
        return await this.secColl.findOne(filter);
    }
    
    async comparePassword(rawPassword, dbPassword){
        return await bcrypt.compare(rawPassword, dbPassword);
    }

    async insertUuid(email, resetPasswdUuid){
        let filter = {"email": email};
        let updateJson ={
            "$set":{ "resetPasswdUuuid" :resetPasswdUuid}
        };
        let result = await this.secColl.updateOne(filter, updateJson);
        return result;
    }

    async changeThePassword(resetPasswdUuid, newPassword){
        let filter = {"resetPasswdUuuid": resetPasswdUuid};

        //Obtener la contraseña vieja
        try {
            var lastPassword = await this.secColl.findOne(filter);
        } catch (error) { console.log("No se pudo obtener la contraseña anterior.") }
        
        let updateJson = {
            "$push":{oldPasswords: lastPassword.password},
            "$set":{
                lastPasswordChange: new Date().getTime(),
                password: await bcrypt.hash(newPassword,10),
                resetPasswdUuuid: null
            }
        }

        let result = await this.secColl.updateOne(filter,updateJson);
        return result
    }
}

module.exports = Users;