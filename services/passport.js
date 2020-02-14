const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy  = require('passport-local');

//create local strategy
const localOptions = {usernameField:'email'};
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
    //verify username and pass if correct call done
    User.findOne({email:email},function(err,user){
        if(err){return done(err);}
        if(!user){return done(null,false)}

        //compare passwords is equal 'password' to user.password?
        user.comparePassword(password,function(err,isMatch){
            if(err){return done(err);}
            if(!isMatch){return done(nul,false);}
            
            return done(null,user)
        })
    })
    
})
//setup jwt stategy
const jwtOptions={
    jwtFromRequest:ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};


// /create jwt Strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload,done){
    //see user id in payload exists i db
    //otherwise call done
    User.findById(payload.sub,function(err,user){
        if(err){return done(err,false);}
        if(user){
            done(null,user);
        }
        else{
            done(null,false);
        }
    })
})
passport.use(jwtLogin);
passport.use(localLogin)