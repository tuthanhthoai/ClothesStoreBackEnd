const express = require("express");
const router = express.Router()
const CategoryController = require('../controllers/CategoryController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare, CategoryController.createCategory)

module.exports = router