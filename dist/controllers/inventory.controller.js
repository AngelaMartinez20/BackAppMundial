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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProducts = void 0;
const database_1 = require("../database");
const logger_1 = __importDefault(require("../logs/logger"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.pool.query("SELECT * FROM products ORDER BY id ASC");
        res.json(result.rows);
    }
    catch (error) {
        logger_1.default.error("Error al obtener productos", error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, stock, image } = req.body;
    try {
        yield database_1.pool.query("INSERT INTO products (name, price, stock, image) VALUES ($1,$2,$3,$4)", [name, price, stock, image]);
        res.status(201).json({ message: "Producto creado correctamente" });
    }
    catch (error) {
        logger_1.default.error("Error al crear producto", error);
        res.status(500).json({ message: "Error al crear producto" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, price, stock, image } = req.body;
    try {
        yield database_1.pool.query("UPDATE products SET name=$1, price=$2, stock=$3, image=$4 WHERE id=$5", [name, price, stock, image, id]);
        res.json({ message: "Producto actualizado correctamente" });
    }
    catch (error) {
        logger_1.default.error("Error al actualizar producto", error);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.pool.query("DELETE FROM products WHERE id=$1", [id]);
        res.json({ message: "Producto eliminado correctamente" });
    }
    catch (error) {
        logger_1.default.error("Error al eliminar producto", error);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});
exports.deleteProduct = deleteProduct;
