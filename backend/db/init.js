const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function initDb() {
  try {
    console.log('Inicializando base de datos PostgreSQL...');
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Tablas creadas correctamente');
    console.log('✅ Datos de blog insertados');
  } catch (err) {
    console.error('❌ Error al inicializar la DB:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
