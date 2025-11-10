import express from 'express';
import turnoController from '../controllers/turnoController.js';
import { requireAuth, requireRole } from '../middleware/index.js';

const router = express.Router();

// Rutas CRUD básicas
router.get('/', turnoController.getAll);
router.get('/:id', turnoController.getById);
router.post('/', requireAuth, requireRole(['Administrativo']), turnoController.create);
router.put('/:id', requireAuth, requireRole(['Administrativo']), turnoController.update);
router.delete('/:id', requireAuth, requireRole(['Administrativo']), turnoController.delete);

// Rutas adicionales para búsquedas específicas
router.get('/paciente/:idPaciente', turnoController.getByPaciente);
router.get('/medico/:idMedico', turnoController.getByMedico);
router.get('/fecha/:fecha', turnoController.getByFecha);
router.get('/completos', turnoController.getTurnosCompletos);

// Ruta para verificar conflictos de horarios
router.post('/verificar-conflicto', requireAuth, requireRole(['Administrativo']), turnoController.verificarConflicto);

export default router;