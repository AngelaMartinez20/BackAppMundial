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
exports.obtenerProductoPorId = exports.obtenerProductos = void 0;
const database_1 = require("../database");
const logger_1 = __importDefault(require("../logs/logger"));
// ✅ Obtener todos los productos disponibles (stock > 0)
const obtenerProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info("📦 Solicitando lista de productos disponibles...");
        const result = yield database_1.pool.query("SELECT id, nombre, precio, imagen, stock FROM productos WHERE stock > 0 ORDER BY id ASC");
        logger_1.default.info(`✅ ${result.rows.length} productos encontrados`);
        res.status(200).json(result.rows);
    }
    catch (error) {
        logger_1.default.error("❌ Error al obtener productos:", error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});
exports.obtenerProductos = obtenerProductos;
// ✅ Obtener detalle de un producto específico
const obtenerProductoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield database_1.pool.query("SELECT id, nombre, descripcion, precio, imagen, stock FROM productos WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        logger_1.default.error("❌ Error al obtener producto por ID:", error);
        res.status(500).json({ message: "Error al obtener producto" });
    }
});
exports.obtenerProductoPorId = obtenerProductoPorId;
