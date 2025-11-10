import express from 'express';
import medicoController from '../controllers/medicoController.js';
import { requireAuth, requireRole } from '../middleware/index.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', medicoController.getAll);
router.get('/:id', medicoController.getById);
router.post('/', requireAuth, requireRole(['Administrativo']), medicoController.create);
router.put('/:id', requireAuth, requireRole(['Administrativo']), medicoController.update);
router.delete('/:id', requireAuth, requireRole(['Administrativo']), medicoController.delete);

// Rutas adicionales para búsquedas específicas
router.get('/dni/:dni', medicoController.getByDNI);
router.get('/especialidad/:especialidad', medicoController.getByEspecialidad);
router.get('/especialidades', medicoController.getEspecialidades);

export default router;