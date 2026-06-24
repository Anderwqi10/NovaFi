const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.pg.controller');
const txCtrl = require('../controllers/transactions.pg.controller');
const favCtrl = require('../controllers/favorites.pg.controller');
const blogCtrl = require('../controllers/blog.pg.controller');
const { pgRequireAuth } = require('../middleware/pg.auth.middleware');

// Auth
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', pgRequireAuth, authCtrl.me);

// Transactions (requiere login)
router.get('/transactions', pgRequireAuth, txCtrl.getMyTransactions);
router.post('/transactions', pgRequireAuth, txCtrl.createTransaction);

// Favorites / watchlist (requiere login)
router.get('/favorites', pgRequireAuth, favCtrl.getMyFavorites);
router.post('/favorites', pgRequireAuth, favCtrl.addFavorite);
router.delete('/favorites/:coinId', pgRequireAuth, favCtrl.removeFavorite);

// Blog (lectura pública)
router.get('/blog', blogCtrl.getAllPosts);
router.get('/blog/:id', blogCtrl.getPostById);

module.exports = router;
