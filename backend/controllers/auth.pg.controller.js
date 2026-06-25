const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const secret = () => process.env.JWT_SECRET || 'change-me';

exports.register = (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Email y contraseña son requeridos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, msg: 'La contraseña debe tener al menos 6 caracteres' });
  }
  try {
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, msg: 'El email ya está registrado' });
    }
    const hash = bcrypt.hashSync(password, 12);
    const result = db.prepare(
      'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)'
    ).run(email.toLowerCase(), hash, username || email.split('@')[0]);
    const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email }, secret(), { expiresIn: '7d' });
    return res.status(201).json({ success: true, data: { token, user } });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Email y contraseña son requeridos' });
  }
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ success: false, msg: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, secret(), { expiresIn: '7d' });
    return res.json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, username: user.username } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.me = (req, res) => {
  try {
    const user = db.prepare(
      'SELECT id, email, username, avatar, wallet_address, created_at FROM users WHERE id = ?'
    ).get(req.pg_user_id);
    if (!user) return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
