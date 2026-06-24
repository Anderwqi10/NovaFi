const pool = require('../db');

exports.getAllPosts = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;
  try {
    let query = 'SELECT id, title, content, category, author, tags, image_url, created_at FROM blog_posts';
    const params = [];
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(
      category ? 'SELECT COUNT(*) FROM blog_posts WHERE category = $1' : 'SELECT COUNT(*) FROM blog_posts',
      category ? [category] : []
    );
    return res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'Post no encontrado' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
