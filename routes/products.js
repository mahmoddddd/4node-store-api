const express = require('express')
const router = express.Router()


const { getAllProductsStatic, getAllProduc } = require('../controllers/products')

router.route('/').get(getAllProduc)
router.route('/static').get(getAllProductsStatic)

module.exports = router