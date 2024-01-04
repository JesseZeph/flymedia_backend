const jwt = require('jsonwebtoken');

const sendError = (res, status, message) => {
  return res.status(status).json({ status: false, message });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendError(res, 403, 'You are not authorized. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) {
      return sendError(res, 403, 'Invalid Token');
    }
    req.user = user;
    next();
  });
};

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    const allowedUserTypes = ['Client', 'Influencer', 'Admin', 'SuperAdmin'];

    if (allowedUserTypes.includes(req.user.userType)) {
      next();
    } else {
      sendError(res, 403, 'You are not authorized for this action.');
    }
  });
};

const verifyClient = (req, res, next) => {
  verifyToken(req, res, () => {
    const allowedUserTypes = ['Client', 'SuperAdmin'];

    if (allowedUserTypes.includes(req.user.userType)) {
      next();
    } else {
      sendError(res, 403, 'You are not authorized as a Client.');
    }
  });
};

const verifyInfluencer = (req, res, next) => {
  verifyToken(req, res, () => {
    const allowedUserTypes = ['Influencer', 'SuperAdmin'];

    if (allowedUserTypes.includes(req.user.userType)) {
      next();
    } else {
      sendError(res, 403, 'You are not authorized as an Influencer.');
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'Admin') {
      next();
    } else {
      sendError(res, 403, 'You are not authorized as an Admin.');
    }
  });
};

const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'SuperAdmin') {
      next();
    } else {
      sendError(res, 403, 'You are not authorized as a SuperAdmin.');
    }
  });
};

module.exports = {
  verifyToken,
  verifyAndAuthorization,
  verifyClient,
  verifyInfluencer,
  verifyAdmin,
  verifySuperAdmin,
};
