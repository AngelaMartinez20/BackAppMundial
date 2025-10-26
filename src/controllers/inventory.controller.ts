import { Request, Response } from "express";
import { pool } from "../database";
import logger from "../logs/logger";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    logger.error("Error al obtener productos", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, stock, image } = req.body;
  try {
    await pool.query(
      "INSERT INTO products (name, price, stock, image) VALUES ($1,$2,$3,$4)",
      [name, price, stock, image]
    );
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    logger.error("Error al crear producto", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id, name, price, stock, image } = req.body;
  try {
    await pool.query(
      "UPDATE products SET name=$1, price=$2, stock=$3, image=$4 WHERE id=$5",
      [name, price, stock, image, id]
    );
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    logger.error("Error al actualizar producto", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    logger.error("Error al eliminar producto", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
