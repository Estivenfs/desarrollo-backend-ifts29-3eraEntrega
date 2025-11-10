import express from 'express';
import pacienteController from '../controllers/pacienteController.js';
import { requireAuth, requireRole } from '../middleware/index.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', pacienteController.getAll);
router.get('/:id', pacienteController.getById);
router.post('/', requireAuth, requireRole(['Administrativo']), pacienteController.create);
router.put('/:id', requireAuth, requireRole(['Administrativo']), pacienteController.update);
router.delete('/:id', requireAuth, requireRole(['Administrativo']), pacienteController.delete);

// Rutas adicionales para búsquedas específicas
router.get('/dni/:dni', pacienteController.getByDNI);
router.get('/obra-social/:obraSocial', pacienteController.getByObraSocial);

export default router;