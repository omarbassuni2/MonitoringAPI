const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if(token){
        jwt.verify(token, ' The very secret key that is both long and secret',
        (err, decodedToken) => {
            if(err){
                console.log('Token verification error!');
                res.redirect('/login');
            }else{
                // console.log(decodedToken);
                next();
            }
        }
        );
    }else{
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    
    if(token){
        jwt.verify(token, ' The very secret key that is both long and secret',
        (err, decodedToken) => {
            if(err){
                res.locals.user = null;
                console.log('Token verification error!');
                next();
            }else{
                //console.log(decodedToken);
                let user =  User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        }
        );
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };