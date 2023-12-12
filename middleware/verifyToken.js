const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: 'Invalid Token' });
      }
      req.user = user;
      next();
    });
  }
};

const verifyAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === 'Client' ||
      req.user.userType === 'Influencer' ||
      req.user.userType === 'Admin' ||
      req.user.userType === 'SuperAdmin'
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: 'You are not authorised' });
    }
  });
};

const verifyClient = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'Client' || req.user.userType === 'SuperAdmin') {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: 'You are not authorised' });
    }
  });
};

const verifyInfluencer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (
      req.user.userType === 'Influencer' ||
      req.user.userType === 'SuperAdmin'
    ) {
      next();
    } else {
      return res
        .status(403)
        .json({ status: false, message: 'You are not authorised' });
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'Admin') {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: 'You are not authorised' });
    }
  });
};

const verifySuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.userType === 'SuperAdmin') {
      next();
    } else {
      res
        .status(403)
        .json({ status: false, message: 'You are not authorised' });
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
