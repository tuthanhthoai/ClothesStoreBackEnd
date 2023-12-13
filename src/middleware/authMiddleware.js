const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
  if (!req.headers.token) {
    return res.status(404).json({
      message: "Authentication error!",
      status: "ERROR",
    });
  }
  const token = req.headers.token.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: 'Authentication error!',
        status: 'ERROR'
      })
    }
    const { isAdmin } = user;
    if (isAdmin) {
      next()
    } else {
      return res.status(404).json({
        message: 'Wrong right!',
        status: 'ERROR'
      })
    }
  });
}

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(' ')[1]
  const userId = req.params.id
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: 'Authentication error!',
        status: 'ERROR'
      })
    }
    const { id, isAdmin } = user;

    if (isAdmin || id === userId) {
      next()
    } else {
      return res.status(404).json({
        message: 'Wrong user or right!',
        status: 'ERROR'
      })
    }
  });
}

module.exports = {
  authMiddleWare,
  authUserMiddleWare
}