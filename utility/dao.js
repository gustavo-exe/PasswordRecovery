var mongoClient = require('mongodb').MongoClient;

//Extraccion de variables de ambiente
var {
    MONGO_USER,
    MONGO_PASSWD,
    MONGO_HOST,
    MONGO_DB
} = process.env;

//Conexion del cliente
var _db = null;
var connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;

var client = new mongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = class{
    static async GetBaseDeDatos(){
        if(!_db){
            try {
                var conn = await client.connect()
                console.log("Conectado a la base de datos");
                _db = conn.db(MONGO_DB);
            } catch (error) {
                console.log("Error al conectar a la base de datos porque: "+error);
                process.exit(1);
            }
        }
        return _db;
    }
}