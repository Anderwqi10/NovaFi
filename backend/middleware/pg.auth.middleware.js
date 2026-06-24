const jwt = require('jsonwebtoken');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

function pgRequireAuth(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, msg: 'Token requerido' });
  }
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
    req.pg_user_id = payload.id;
    req.pg_email = payload.email;
    next();
  } catch {
    return res.status(401).json({ success: false, msg: 'Token inválido o expirado' });
  }
}

module.exports = { pgRequireAuth };
