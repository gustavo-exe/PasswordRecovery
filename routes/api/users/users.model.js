var conexion = require('../../../utility/dao');
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
}

module.exports = Users;