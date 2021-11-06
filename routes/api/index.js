var express = require('express');
var router = express.Router();

//Rutas de archivos
var usersRouter = require('./users/index')

//Passport
const passport = require('passport');
const passportJWT = require('passport-jwt');
const extractJWT = passportJWT.ExtractJwt;
const strategyJWT = passportJWT.Strategy;

passport.use(
        new strategyJWT({
            jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        },
        (payload, next) => {
            return next(null, payload);
        }
    )
)

const jwtMiddleware = passport.authenticate('jwt',{session: false});

//Peticion
router.get('/', (req, res, nex)=>{
    res.status(200).json({msg:"API PasswordRecovery"})
})

//Rutas de uso para acceder a las peticiones de un segmento
router.use(passport.initialize());
router.use('/users',usersRouter);


module.exports = router;