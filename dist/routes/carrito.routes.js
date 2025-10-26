"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_controller_1 = require("../controllers/carrito.controller");
const authenticateUser_1 = require("../middlewares/authenticateUser");
const router = (0, express_1.Router)();
// ✅ Todas las rutas requieren que el usuario esté autenticado
router.get('/', authenticateUser_1.authenticateUser, carrito_controller_1.obtenerCarrito);
router.post('/', authenticateUser_1.authenticateUser, carrito_controller_1.agregarAlCarrito);
router.put('/:id', authenticateUser_1.authenticateUser, carrito_controller_1.actualizarCantidad);
router.delete('/:id', authenticateUser_1.authenticateUser, carrito_controller_1.eliminarDelCarrito);
exports.default = router;
