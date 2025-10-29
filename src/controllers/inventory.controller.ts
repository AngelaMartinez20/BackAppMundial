import { Request, Response } from "express";
import { pool } from "../database";
import logger from "../logs/logger";

// 🛍️ Obtener todos los productos
export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    logger.error("❌ Error al obtener productos", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// ➕ Crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  const { nombre, descripcion, precio, stock, imagenes } = req.body;

  try {
    await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock, imagenes) VALUES ($1, $2, $3, $4, $5)",
      [nombre, descripcion, precio, stock, imagenes]
    );
    res.status(201).json({ message: "✅ Producto creado correctamente" });
  } catch (error) {
    logger.error("❌ Error al crear producto", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// ✏️ Actualizar un producto existente
export const updateProduct = async (req: Request, res: Response) => {
  const { id, nombre, descripcion, precio, stock, imagenes } = req.body;

  try {
    await pool.query(
      "UPDATE productos SET nombre=$1, descripcion=$2, precio=$3, stock=$4, imagenes=$5 WHERE id=$6",
      [nombre, descripcion, precio, stock, imagenes, id]
    );
    res.json({ message: "✅ Producto actualizado correctamente" });
  } catch (error) {
    logger.error("❌ Error al actualizar producto", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// 🗑️ Eliminar un producto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM productos WHERE id=$1", [id]);
    res.json({ message: "🗑️ Producto eliminado correctamente" });
  } catch (error) {
    logger.error("❌ Error al eliminar producto", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
