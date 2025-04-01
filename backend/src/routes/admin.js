const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/auth');

const adminController = new AdminController();

// Rotas públicas
router.post('/login', adminController.login.bind(adminController));

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Rotas protegidas
router.post('/logout', adminController.logout.bind(adminController));
router.get('/me', adminController.getProfile.bind(adminController));
router.put('/me', adminController.updateProfile.bind(adminController));
router.get('/dashboard', adminController.getDashboardData.bind(adminController));

module.exports = router; 