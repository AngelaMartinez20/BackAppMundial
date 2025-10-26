"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarDelCarrito = exports.actualizarCantidad = exports.agregarAlCarrito = exports.obtenerCarrito = void 0;
const database_1 = require("../database");
const logger_1 = __importDefault(require("../logs/logger"));
// 🛒 Ver Carrito
const obtenerCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!usuarioId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        logger_1.default.info(`🛒 Solicitando carrito del usuario ${usuarioId}`);
        const result = yield database_1.pool.query(`SELECT c.id, c.cantidad, p.nombre, p.precio, p.imagenes 
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = $1`, [usuarioId]);
        let subtotal = 0;
        const items = result.rows.map((item) => {
            var _a;
            const imagen = ((_a = item.imagenes) === null || _a === void 0 ? void 0 : _a.length) > 0 ? item.imagenes[0] : null;
            const totalItem = item.precio * item.cantidad;
            subtotal += totalItem;
            return {
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                imagen,
                totalItem
            };
        });
        logger_1.default.info(`✅ Carrito obtenido correctamente`, { items: items.length });
        res.status(200).json({ message: 'Carrito de compras', subtotal, total: subtotal, items });
    }
    catch (error) {
        logger_1.default.error(`❌ Error al obtener carrito`, error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.obtenerCarrito = obtenerCarrito;
// ➕ Agregar al Carrito
const agregarAlCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!usuarioId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const { producto_id, cantidad } = req.body;
        logger_1.default.info(`➕ Agregando producto ${producto_id} x${cantidad} al carrito del usuario ${usuarioId}`);
        const exists = yield database_1.pool.query(`SELECT id, cantidad FROM carrito WHERE usuario_id = $1 AND producto_id = $2`, [usuarioId, producto_id]);
        if (exists.rows.length > 0) {
            const nuevaCantidad = exists.rows[0].cantidad + cantidad;
            yield database_1.pool.query(`UPDATE carrito SET cantidad = $1 WHERE id = $2`, [nuevaCantidad, exists.rows[0].id]);
        }
        else {
            yield database_1.pool.query(`INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3)`, [usuarioId, producto_id, cantidad]);
        }
        res.status(201).json({ message: 'Producto agregado al carrito' });
    }
    catch (error) {
        logger_1.default.error(`❌ Error al agregar al carrito`, error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.agregarAlCarrito = agregarAlCarrito;
// 🔄 Modificar Cantidad
const actualizarCantidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!usuarioId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const { id } = req.params;
        const { cantidad } = req.body;
        logger_1.default.info(`🔄 Usuario ${usuarioId} actualizando cantidad del item ${id} → ${cantidad}`);
        // Asegurarse de que el item pertenece al usuario
        yield database_1.pool.query(`UPDATE carrito SET cantidad = $1 WHERE id = $2 AND usuario_id = $3`, [cantidad, id, usuarioId]);
        res.status(200).json({ message: 'Cantidad actualizada' });
    }
    catch (error) {
        logger_1.default.error(`❌ Error al actualizar cantidad`, error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.actualizarCantidad = actualizarCantidad;
// 🗑 Eliminar artículo
const eliminarDelCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const usuarioId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!usuarioId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }
        const { id } = req.params;
        logger_1.default.info(`🗑 Usuario ${usuarioId} eliminando item ${id} del carrito`);
        yield database_1.pool.query(`DELETE FROM carrito WHERE id = $1 AND usuario_id = $2`, [id, usuarioId]);
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    }
    catch (error) {
        logger_1.default.error(`❌ Error al eliminar item`, error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.eliminarDelCarrito = eliminarDelCarrito;
