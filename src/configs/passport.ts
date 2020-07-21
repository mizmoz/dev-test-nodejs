import LocalStrategy from 'passport-local';
import authenticate from '../api/authenticate';
import {PassportStatic} from 'passport'

export default (passport : PassportStatic ) => {
    passport.use(new LocalStrategy.Strategy({usernameField: "username"},
        (username, password, done) => {
            authenticate(username, password)
            .then(response => {
                if(response) return done(null, {username: username, password: password})
                else return done(null, false)
            })
            
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}