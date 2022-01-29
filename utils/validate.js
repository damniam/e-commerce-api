const validator = require("validator");

const checkEmail = (email) => {
  return email && validator.isEmail(email);
};


module.exports = checkEmail;