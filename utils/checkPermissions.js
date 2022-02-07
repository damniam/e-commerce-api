const CustomError = require("../errors");

const checkPermissions = (requestUser, responseId) => {
  if (requestUser.role == "admin") return;
  if (requestUser.userId === responseId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};


module.exports = checkPermissions; 