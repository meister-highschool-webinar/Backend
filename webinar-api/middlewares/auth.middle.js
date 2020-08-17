const jwt = require('jsonwebtoken');

const verifyJWT = (accessToken, salt) => new Promise((res, rej) => {
  jwt.verify(accessToken, salt, (err, decoded) => {
    if(err) rej(err);
    res(decoded);
  })
})

exports.userAuth = async (req, res, next) => {
  next();
  // try {
  //   const headers = req.headers;
  //   const payload = await verifyJWT(headers.authorization);
  // } catch (e) {
  //   res.status(401).json({
  //     msg: "인증에 실패하였습니다.",
  //     msgId: 401
  //   })
  // }
}

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.query.token;
    await verifyJWT(token, process.env.JWT_ADMIN_SALT);
    next();
  } catch (e) {
    res.status(401).json({
      msg: "인증에 실패하였습니다.",
      msgId: 401
    })
  }
}