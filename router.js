const authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// authentication middlewares
const requireToken = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.get('/', requireToken, function(req, res) {
        res.send({ message: 'This is protected route!' });
    });
    app.post('/register', authentication.register);
    app.post('/login', requireLogin, authentication.login);
}
