import passport from 'passport';

// import all the strategies here:
import RegisterStrategy from './registerStrategy';
import LogInStrategy from './logInStrategy';

passport.use('local-register', RegisterStrategy);
passport.use('local-login', LogInStrategy)

export default passport;