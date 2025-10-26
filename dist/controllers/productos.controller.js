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
exports.obtenerProducto = exports.obtenerCatalogo = void 0;
const database_1 = require("../database");
const logger_1 = __importDefault(require("../logs/logger"));
// ✅ Obtener catálogo de productos disponibles (Vista Home)
const obtenerCatalogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info(`🛍️ Solicitando catálogo de productos`);
        const result = yield database_1.pool.query(`SELECT id, nombre, precio, imagenes 
       FROM productos 
       WHERE stock > 0 
       ORDER BY id DESC`);
        // Formatear para mostrar imagen principal
        const productos = result.rows.map((producto) => {
            var _a;
            return ({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: ((_a = producto.imagenes) === null || _a === void 0 ? void 0 : _a.length) > 0 ? producto.imagenes[0] : null
            });
        });
        logger_1.default.info(`✅ Catálogo obtenido`, { totalProductos: productos.length });
        res.status(200).json({
            message: 'Catálogo de productos disponibles',
            data: productos
        });
    }
    catch (error) {
        logger_1.default.error('❌ Error al obtener catálogo de productos', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.obtenerCatalogo = obtenerCatalogo;
// ✅ Obtener detalle de producto por ID (Vista Detalle)
const obtenerProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        logger_1.default.info(`🔍 Solicitando detalles del producto con ID ${id}`);
        const result = yield database_1.pool.query(`SELECT id, nombre, descripcion, precio, stock, imagenes 
       FROM productos 
       WHERE id = $1`, [id]);
        if (result.rows.length === 0) {
            logger_1.default.warn(`⚠️ Producto con ID ${id} no encontrado`);
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }
        const producto = result.rows[0];
        logger_1.default.info(`✅ Producto encontrado`, { productoId: producto.id });
        res.status(200).json({
            message: 'Detalle del producto',
            data: {
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                imagenes: producto.imagenes // Galería completa
            }
        });
    }
    catch (error) {
        logger_1.default.error(`❌ Error al obtener el producto`, error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.obtenerProducto = obtenerProducto;
