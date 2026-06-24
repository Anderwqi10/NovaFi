const pool = require('../db');

exports.getMyTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.pg_user_id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  const { type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash } = req.body;
  if (!type || !coin_id || !coin_symbol || amount_usd === undefined || amount_coin === undefined) {
    return res.status(400).json({ success: false, msg: 'Faltan campos: type, coin_id, coin_symbol, amount_usd, amount_coin' });
  }
  const validTypes = ['swap', 'buy', 'sell', 'transfer'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, msg: `type debe ser uno de: ${validTypes.join(', ')}` });
  }
  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed') RETURNING *`,
      [req.pg_user_id, type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash || null]
    );
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
