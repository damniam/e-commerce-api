const CustomError = require("../errors");
const { verifyJWT } = require("../utils/jwt");

const roles = ["admin", "owner"];

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  console.log(token);
  if (!token) {
    throw new CustomError.UnauthenticatedError("Token missing ");
  }

  try {
    const { name, userId, role } = verifyJWT({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authentizePermissions = (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new CustomError.UnauthorizedError(
      "Unauthorized to access this route"
    );
  }
  next();
};

module.exports = { authenticateUser, authentizePermissions };
