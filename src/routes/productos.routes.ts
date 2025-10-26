import { Router } from 'express';
import { obtenerCatalogo, obtenerProducto } from '../controllers/productos.controller';

const router = Router();

router.get('/', obtenerCatalogo); // Home
router.get('/:id', obtenerProducto); // Detalle

export default router;
