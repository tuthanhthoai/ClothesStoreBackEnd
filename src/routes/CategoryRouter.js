const express = require("express");
const router = express.Router()
const CategoryController = require('../controllers/CategoryController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare, CategoryController.createCategory)
router.put('/update/:id', authMiddleWare, CategoryController.updateCategory)
router.delete('/delete/:id', authMiddleWare, CategoryController.deleteCategory)
router.get('/get-all', CategoryController.getAllCategory)
router.get('/get-details/:id', CategoryController.getCategoryDetail)
router.post('/delete-many', authMiddleWare, CategoryController.deleteMany)

module.exports = router