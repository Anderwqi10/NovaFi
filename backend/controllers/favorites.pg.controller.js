const db = require('../db');

exports.getMyFavorites = (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC'
    ).all(req.pg_user_id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.addFavorite = (req, res) => {
  const { coin_id, coin_name, coin_symbol } = req.body;
  if (!coin_id || !coin_name || !coin_symbol) {
    return res.status(400).json({ success: false, msg: 'Faltan campos: coin_id, coin_name, coin_symbol' });
  }
  try {
    db.prepare(
      'INSERT OR IGNORE INTO favorites (user_id, coin_id, coin_name, coin_symbol) VALUES (?, ?, ?, ?)'
    ).run(req.pg_user_id, coin_id, coin_name, coin_symbol);
    return res.json({ success: true, msg: 'Guardado en favoritos' });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.removeFavorite = (req, res) => {
  try {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND coin_id = ?').run(req.pg_user_id, req.params.coinId);
    return res.json({ success: true, msg: 'Eliminado de favoritos' });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
