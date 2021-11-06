const express = require("express");
let router = express.Router();

let userModelClass = require('./users.model.js');
let userModel = new userModelClass();

router.get('/', (req, res, nex)=>{
    res.status(200).json({msg:"Users index"})
})

module.exports = router;