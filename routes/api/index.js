var express = require('express');
var router = express.Router();

router.get('/', (req, res, nex)=>{
    res.status(200).json({msg:"Password Recovery"})
})

module.exports = router;