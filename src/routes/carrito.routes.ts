import { Router } from 'express';
import { obtenerCarrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito } from '../controllers/carrito.controller';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = Router();

// ✅ Todas las rutas requieren que el usuario esté autenticado
router.get('/', authenticateUser, obtenerCarrito);
router.post('/', authenticateUser, agregarAlCarrito);
router.put('/:id', authenticateUser, actualizarCantidad);
router.delete('/:id', authenticateUser, eliminarDelCarrito);

export default router;
