import { Request, Response } from 'express';
import { pool } from '../database';
import logger from '../logs/logger';

// 🛒 Ver Carrito
export const obtenerCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    logger.info(`🛒 Solicitando carrito del usuario ${usuarioId}`);

    const result = await pool.query(
      `SELECT c.id, c.cantidad, p.nombre, p.precio, p.imagenes 
       FROM carrito c
       JOIN productos p ON c.producto_id = p.id
       WHERE c.usuario_id = $1`,
      [usuarioId]
    );

    let subtotal = 0;
    const items = result.rows.map((item: any) => {
      const imagen = item.imagenes?.length > 0 ? item.imagenes[0] : null;
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

    logger.info(`✅ Carrito obtenido correctamente`, { items: items.length });

    res.status(200).json({ message: 'Carrito de compras', subtotal, total: subtotal, items });

  } catch (error) {
    logger.error(`❌ Error al obtener carrito`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ➕ Agregar al Carrito
export const agregarAlCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { producto_id, cantidad } = req.body;

    logger.info(`➕ Agregando producto ${producto_id} x${cantidad} al carrito del usuario ${usuarioId}`);

    const exists = await pool.query(
      `SELECT id, cantidad FROM carrito WHERE usuario_id = $1 AND producto_id = $2`,
      [usuarioId, producto_id]
    );

    if (exists.rows.length > 0) {
      const nuevaCantidad = exists.rows[0].cantidad + cantidad;
      await pool.query(`UPDATE carrito SET cantidad = $1 WHERE id = $2`, [nuevaCantidad, exists.rows[0].id]);
    } else {
      await pool.query(`INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES ($1, $2, $3)`, [usuarioId, producto_id, cantidad]);
    }

    res.status(201).json({ message: 'Producto agregado al carrito' });

  } catch (error) {
    logger.error(`❌ Error al agregar al carrito`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 🔄 Modificar Cantidad
export const actualizarCantidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { id } = req.params;
    const { cantidad } = req.body;

    logger.info(`🔄 Usuario ${usuarioId} actualizando cantidad del item ${id} → ${cantidad}`);

    // Asegurarse de que el item pertenece al usuario
    await pool.query(`UPDATE carrito SET cantidad = $1 WHERE id = $2 AND usuario_id = $3`, [cantidad, id, usuarioId]);

    res.status(200).json({ message: 'Cantidad actualizada' });

  } catch (error) {
    logger.error(`❌ Error al actualizar cantidad`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// 🗑 Eliminar artículo
export const eliminarDelCarrito = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarioId = req.user?.id;
    if (!usuarioId) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const { id } = req.params;

    logger.info(`🗑 Usuario ${usuarioId} eliminando item ${id} del carrito`);

    await pool.query(`DELETE FROM carrito WHERE id = $1 AND usuario_id = $2`, [id, usuarioId]);

    res.status(200).json({ message: 'Producto eliminado del carrito' });

  } catch (error) {
    logger.error(`❌ Error al eliminar item`, error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
