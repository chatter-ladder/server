import passport from 'passport';

// import all the strategies here:
import registerStrategy from './registerStrategy.js';
import logInStrategy from './logInStrategy.js';

passport.use('local-register', registerStrategy);
passport.use('local-login', logInStrategy)

export default passport;