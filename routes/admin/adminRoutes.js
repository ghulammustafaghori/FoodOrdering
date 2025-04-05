const adminController = require('../../controllers/admin/adminController');
const express = require('express');
const adminRoutes = express.Router();

adminRoutes.get('/admin-list', adminController.adminList);
adminRoutes.post('/insert-admin', adminController.insertAdmin);
adminRoutes.put('/update-admin/:id', adminController.updateAdmin);
adminRoutes.delete('/delete-admin/:id', adminController.deleteAdmin);

module.exports = adminRoutes;