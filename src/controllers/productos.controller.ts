import { Request, Response } from 'express';
import { pool } from '../database';
import logger from '../logs/logger';

// ✅ Obtener catálogo de productos disponibles (Vista Home)
export const obtenerCatalogo = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info(`🛍️ Solicitando catálogo de productos`);

    const result = await pool.query(
      `SELECT id, nombre, precio, imagenes 
       FROM productos 
       WHERE stock > 0 
       ORDER BY id DESC`
    );

    // Formatear para mostrar imagen principal
    const productos = result.rows.map((producto: any) => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagenes?.length > 0 ? producto.imagenes[0] : null
    }));

    logger.info(`✅ Catálogo obtenido`, { totalProductos: productos.length });

    res.status(200).json({
      message: 'Catálogo de productos disponibles',
      data: productos
    });

  } catch (error) {
    logger.error('❌ Error al obtener catálogo de productos', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ✅ Obtener detalle de producto por ID (Vista Detalle)
export const obtenerProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    logger.info(`🔍 Solicitando detalles del producto con ID ${id}`);

    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, stock, imagenes 
       FROM productos 
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      logger.warn(`⚠️ Producto con ID ${id} no encontrado`);
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    const producto = result.rows[0];

    logger.info(`✅ Producto encontrado`, { productoId: producto.id });

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

  } catch (error) {
    logger.error(`❌ Error al obtener el producto`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
