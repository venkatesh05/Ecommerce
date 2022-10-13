const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err)
        res.status(403).json({
          code: "403",
          message: "Token not valid",
        });

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({
      code: "401",
      message: "User not Authorized",
    });
  }
};

const verifyTokenAndAuthosization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        code: "403",
        message: "Your not allowed this action",
      });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        code: "403",
        message: "Your not allowed this action",
      });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthosization,
  verifyTokenAndAdmin,
};
