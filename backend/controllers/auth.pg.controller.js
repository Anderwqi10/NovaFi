const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const secret = () => process.env.JWT_SECRET || 'change-me';

exports.register = async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Email y contraseña son requeridos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, msg: 'La contraseña debe tener al menos 6 caracteres' });
  }
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, msg: 'El email ya está registrado' });
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username, created_at',
      [email.toLowerCase(), hash, username || email.split('@')[0]]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, secret(), { expiresIn: '7d' });
    return res.status(201).json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, username: user.username } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, msg: 'Email y contraseña son requeridos' });
  }
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, msg: 'Credenciales inválidas' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
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

exports.me = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, avatar, wallet_address, created_at FROM users WHERE id = $1',
      [req.pg_user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'Usuario no encontrado' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
