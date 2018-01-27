# Express Server Boilerplate
### Boilerplate for Node projects backend with authorization set up.

JWT based authorization pre-set using Passport.

Boilerplate requires a config.js file to be created locally (git-ignored), that contains secret string for JWT and database URL:

```
const config = { 
    secret: 'your secret string',
    databaseURL: 'address'
}
    
```