const jwt = require('json-web-token');
require('dotenv').config();

module.exports = class AuthManager {
  static GetAuthUser(authorization) {
    let authUser = null;
    if (authorization) {
      let token = authorization.split(' ')[1];
      let decoded = jwt.decode(process.env.JWT_SECRET, token);
      if (decoded.value && Math.floor(Date.now() / 1000) < decoded.value.exp) {
        authUser = {
          login: decoded.value.login,
          userType: decoded.value.userType,
        };
      }
    }
    console.log(authUser);
    return authUser;
  }
};
