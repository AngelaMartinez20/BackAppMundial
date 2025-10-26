"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productosController_1 = require("../controllers/productosController");
const router = (0, express_1.Router)();
// 🔹 GET /api/productos → lista de productos disponibles
router.get("/", productosController_1.obtenerProductos);
// 🔹 GET /api/productos/:id → detalle de un producto
router.get("/:id", productosController_1.obtenerProductoPorId);
exports.default = router;
