import { Router, Request, Response } from 'express';
// 1. IMPORTA LA NUEVA FUNCIÓN AQUÍ
import { 
    getUsers, 
    updateUserRole, 
    deleteUser,
    resetUserPassword // <-- Añadido
} from '../controllers/admin';
import { authenticateUser, authorizeRoles } from '../middlewares/authenticateUser';

const router = Router();

router.get('/dashboard', authenticateUser, authorizeRoles('admin'), (req: Request, res: Response) => {
    res.render('admin', { user: req.user });
});

router.get('/dashboard/data', authenticateUser, authorizeRoles('admin'), (req: Request, res: Response) => {
    res.json({ message: 'Bienvenido al panel de administración', user: req.user });
});

// ✅ API para gestionar usuarios
router.get('/users', authenticateUser, authorizeRoles('admin'), getUsers);

// ✅ Ruta para actualizar el rol de un usuario
router.put('/users/role', authenticateUser, authorizeRoles('admin'), updateUserRole);

// ✅ Ruta para eliminar un usuario
router.delete('/users/:id', authenticateUser, authorizeRoles('admin'), deleteUser);

// 2. AÑADE LA NUEVA RUTA AQUÍ
// ✅ Ruta para reiniciar la contraseña de un usuario
router.put('/users/password', 
    authenticateUser, 
    authorizeRoles('admin'), 
    resetUserPassword
);

export default router;