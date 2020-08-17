const jwt = require('jsonwebtoken');

const verifyJWT = accessToken => new Promise((res, rej) => {
  jwt.verify(accessToken, process.env.JWT_SALT, (err, decoded) => {
    if(err) rej(err);
    res(decoded);
  })
})

exports.auth = async (req, res, next) => {
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