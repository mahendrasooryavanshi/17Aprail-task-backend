const jwt = require("jsonwebtoken");

const secretJson = require("../../constent/secret.json");

const TokenValidation = {
  generateAccessToken: async (payload) => {
    let secret = secretJson.SecretKEY;
    const options = {
      expiresIn: secretJson.AccessTokenExpireTime,
    };
    return await jwt.sign(payload, secret, options);
  },

  generateRefreshToken: async (payload) => {
    let secret = secretJson.SecretKEY;
    const options = {
      expiresIn: secretJson.RefreshTokenExpireTime,
    };

    return await jwt.sign(payload, secret, options);
  },
  authToken: async (token) => {
    try {
      return await jwt.verify(token, secretJson.SecretKEY, (error, decoded) => {
        if (error) {
          return {
            status: false,
            error: error,
            verify: {},
          };
        }
        return {
          status: true,
          verify: decoded,
        };
      });
    } catch (error) {
      return {
        status: false,
        error: error,
        verify: {},
      };
    }
  },
};

module.exports = TokenValidation;
