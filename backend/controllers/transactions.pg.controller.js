const db = require('../db');

exports.getMyTransactions = (req, res) => {
  try {
    const rows = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50'
    ).all(req.pg_user_id);
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.createTransaction = (req, res) => {
  const { type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash } = req.body;
  if (!type || !coin_id || !coin_symbol || amount_usd === undefined || amount_coin === undefined) {
    return res.status(400).json({ success: false, msg: 'Faltan campos: type, coin_id, coin_symbol, amount_usd, amount_coin' });
  }
  const validTypes = ['swap', 'buy', 'sell', 'transfer'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, msg: `type debe ser: ${validTypes.join(', ')}` });
  }
  try {
    const result = db.prepare(
      `INSERT INTO transactions (user_id, type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`
    ).run(req.pg_user_id, type, coin_id, coin_symbol, amount_usd, amount_coin, tx_hash || null);
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, data: row });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
