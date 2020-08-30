import LocalStrategy from 'passport-local';
// Do I need to import a user model here?

const registerStrategy = new LocalStrategy.Strategy((username, password, done) => {

});

export default registerStrategy;