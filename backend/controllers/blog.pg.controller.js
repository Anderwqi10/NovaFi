const db = require('../db');

exports.getAllPosts = (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const offset = parseInt(req.query.offset) || 0;
  const category = req.query.category;
  try {
    let rows, total;
    if (category) {
      rows = db.prepare(
        'SELECT id, title, content, category, author, tags, image_url, created_at FROM blog_posts WHERE category = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
      ).all(category, limit, offset);
      total = db.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE category = ?').get(category).count;
    } else {
      rows = db.prepare(
        'SELECT id, title, content, category, author, tags, image_url, created_at FROM blog_posts ORDER BY created_at DESC LIMIT ? OFFSET ?'
      ).all(limit, offset);
      total = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get().count;
    }
    rows = rows.map((r) => ({ ...r, tags: JSON.parse(r.tags || '[]') }));
    return res.json({ success: true, data: rows, total });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getPostById = (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM blog_posts WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ success: false, msg: 'Post no encontrado' });
    row.tags = JSON.parse(row.tags || '[]');
    return res.json({ success: true, data: row });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
};
