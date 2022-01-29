const User = require('../models/User');

const login = async (req, res) => {
  res.send("login user");
};
const register = async (req, res) => {
    console.log(req.body);
    await User.create(req.body);
    res.send("register user");
};
const logout = async (req, res) => {
  res.send("logout user");
};

module.exports = { login, register, logout };
