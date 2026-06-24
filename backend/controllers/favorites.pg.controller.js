const pool = require('../db');

exports.getMyFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY added_at DESC',
      [req.pg_user_id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  const { coin_id, coin_name, coin_symbol } = req.body;
  if (!coin_id || !coin_name || !coin_symbol) {
    return res.status(400).json({ success: false, msg: 'Faltan campos: coin_id, coin_name, coin_symbol' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, coin_id, coin_name, coin_symbol)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, coin_id) DO NOTHING RETURNING *`,
      [req.pg_user_id, coin_id, coin_name, coin_symbol]
    );
    return res.json({ success: true, data: result.rows[0] || null, msg: 'Guardado en favoritos' });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  const { coinId } = req.params;
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND coin_id = $2',
      [req.pg_user_id, coinId]
    );
    return res.json({ success: true, msg: 'Eliminado de favoritos' });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
