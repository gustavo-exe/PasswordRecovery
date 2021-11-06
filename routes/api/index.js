var express = require('express');
var router = express.Router();

//Rutas
var usersRouter = require('./users/index')
router.use('/users',usersRouter);

router.get('/', (req, res, nex)=>{
    res.status(200).json({msg:"Password Recovery"})
})

module.exports = router;