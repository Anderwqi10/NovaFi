CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  avatar VARCHAR(500),
  wallet_address VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('swap', 'buy', 'sell', 'transfer')),
  coin_id VARCHAR(100) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  amount_usd DECIMAL(20, 8) NOT NULL,
  amount_coin DECIMAL(30, 18) NOT NULL,
  tx_hash VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  coin_id VARCHAR(100) NOT NULL,
  coin_name VARCHAR(100) NOT NULL,
  coin_symbol VARCHAR(20) NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, coin_id)
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  author VARCHAR(100) DEFAULT 'Admin',
  tags JSONB DEFAULT '[]',
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO blog_posts (title, content, category, author, tags, image_url) VALUES
(
  'Bitcoin alcanza nuevo máximo histórico',
  'Bitcoin superó los $100,000 USD esta semana, consolidándose como el activo digital más valioso del mundo. Los analistas atribuyen este aumento a la mayor adopción institucional y la reducción de la oferta tras el último halving. El interés abierto en contratos de futuros también marcó récords, señalando una confianza renovada del mercado.',
  'Mercado',
  'CryptoDesk',
  '["Bitcoin", "BTC", "Precio"]',
  'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400'
),
(
  'Ethereum 2.0: El futuro del proof-of-stake',
  'La transición de Ethereum al mecanismo de consenso proof-of-stake ha reducido el consumo de energía en un 99.95%. Exploramos las implicaciones técnicas y económicas de este cambio histórico en la red. El staking se ha convertido en una forma popular de obtener rendimientos pasivos sobre ETH.',
  'Tecnología',
  'ETH Team',
  '["Ethereum", "ETH", "PoS"]',
  'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=400'
),
(
  'DeFi: Oportunidades y riesgos en 2026',
  'Las finanzas descentralizadas continúan creciendo con más de $200 mil millones en valor total bloqueado. Analizamos los protocolos más prometedores y los riesgos que los inversores deben considerar antes de entrar al ecosistema. Los smart contracts, aunque poderosos, presentan vectores de ataque únicos.',
  'DeFi',
  'DeFi Analyst',
  '["DeFi", "Finanzas", "Yield"]',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400'
),
(
  'NFTs: ¿Moda o revolución digital?',
  'El mercado de NFTs ha evolucionado más allá de las imágenes digitales. Exploramos casos de uso en gaming, música, bienes raíces digitales y cómo los creadores están monetizando su trabajo como nunca antes. Los tokens no fungibles están redefiniendo la propiedad en el mundo digital.',
  'NFT',
  'Digital Arts',
  '["NFT", "Arte", "Web3"]',
  'https://images.unsplash.com/photo-1645378999013-95abebf5f3c1?w=400'
),
(
  'Regulación crypto: Guía global 2026',
  'Los gobiernos de todo el mundo están implementando marcos regulatorios para las criptomonedas. Esta guía resume el estado actual de la regulación en Europa, Estados Unidos, Asia y América Latina, y qué significa para inversores y proyectos blockchain.',
  'Regulación',
  'Legal Team',
  '["Regulación", "Legal", "Gobierno"]',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
),
(
  'Guía completa de wallets crypto',
  'Todo lo que necesitas saber para elegir y configurar tu wallet de criptomonedas: hardware wallets, software wallets, custodial vs non-custodial, y las mejores prácticas de seguridad para proteger tus activos digitales de amenazas comunes.',
  'Educación',
  'Security Expert',
  '["Wallet", "Seguridad", "Guía"]',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'
)
ON CONFLICT DO NOTHING;
