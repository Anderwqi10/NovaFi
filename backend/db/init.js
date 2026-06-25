const fs = require('fs');
const path = require('path');
const db = require('./index');

const BLOG_POSTS = [
  ['Bitcoin alcanza nuevo máximo histórico', 'Bitcoin superó los $100,000 USD esta semana, consolidándose como el activo digital más valioso del mundo. Los analistas atribuyen este aumento a la mayor adopción institucional y la reducción de la oferta tras el último halving.', 'Mercado', 'CryptoDesk', '["Bitcoin","BTC","Precio"]', 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400'],
  ['Ethereum 2.0: El futuro del proof-of-stake', 'La transición de Ethereum al mecanismo de consenso proof-of-stake ha reducido el consumo de energía en un 99.95%. El staking se ha convertido en una forma popular de obtener rendimientos pasivos sobre ETH.', 'Tecnología', 'ETH Team', '["Ethereum","ETH","PoS"]', 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400'],
  ['DeFi: Oportunidades y riesgos en 2026', 'Las finanzas descentralizadas continúan creciendo con más de $200 mil millones en valor total bloqueado. Analizamos los protocolos más prometedores y los riesgos que los inversores deben considerar.', 'DeFi', 'DeFi Analyst', '["DeFi","Finanzas","Yield"]', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400'],
  ['NFTs: ¿Moda o revolución digital?', 'El mercado de NFTs ha evolucionado más allá de las imágenes digitales. Exploramos casos de uso en gaming, música, bienes raíces digitales y cómo los creadores están monetizando su trabajo.', 'NFT', 'Digital Arts', '["NFT","Arte","Web3"]', 'https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?w=400'],
  ['Regulación crypto: Guía global 2026', 'Los gobiernos de todo el mundo están implementando marcos regulatorios para las criptomonedas. Esta guía resume el estado actual en Europa, Estados Unidos, Asia y América Latina.', 'Regulación', 'Legal Team', '["Regulación","Legal","Gobierno"]', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'],
  ['Guía completa de wallets crypto', 'Todo lo que necesitas saber para elegir y configurar tu wallet: hardware wallets, software wallets, custodial vs non-custodial y las mejores prácticas de seguridad.', 'Educación', 'Security Expert', '["Wallet","Seguridad","Guía"]', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'],
];

function initDb() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schema);

    const { count } = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get();
    if (count === 0) {
      const insert = db.prepare(
        'INSERT INTO blog_posts (title, content, category, author, tags, image_url) VALUES (?, ?, ?, ?, ?, ?)'
      );
      const insertMany = db.transaction((posts) => {
        for (const post of posts) insert.run(...post);
      });
      insertMany(BLOG_POSTS);
    }

    console.log('✅ Base de datos SQLite lista →', require('path').join(__dirname, '../database.sqlite'));
  } catch (err) {
    console.error('❌ Error al inicializar la DB:', err.message);
  }
}

module.exports = { initDb };

// Permite correrlo directamente: node db/init.js
if (require.main === module) {
  initDb();
  process.exit(0);
}
