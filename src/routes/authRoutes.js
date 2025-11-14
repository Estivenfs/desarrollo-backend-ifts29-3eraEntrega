import express from 'express';
import authController from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/index.js';
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Models } from '../models/index.js'

const router = express.Router();

router.post('/register', requireAuth, requireRole(['Administrativo']), authController.register);
router.post('/login', authController.login);
router.post('/logout', requireAuth, authController.logout);

// Configuración de Passport Google OAuth2
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = (profile.emails && profile.emails[0] && profile.emails[0].value) || null;
    if (!email) return done(null, false, { message: 'Email no disponible desde Google' });
    const existing = await Models['usuarios'].findOne({ Username: email });
    if (existing) {
      if (existing.Role !== 'Paciente') {
        return done(null, false, { message: 'Solo pacientes pueden iniciar sesión con Google' });
      }
      const userPayload = {
        id: existing._id,
        username: existing.Username,
        role: existing.Role,
        medicoId: existing.MedicoRef || null,
        pacienteId: existing.PacienteRef || null
      };
      return done(null, userPayload);
    }
    // Usuario no existe: marcar para registro (paciente)
    return done(null, { username: email, role: 'Paciente' });
  } catch (err) {
    return done(err);
  }
}))

// Endpoints de Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), async (req, res) => {
  const user = req.user;
  if (!user) return res.redirect('/login?error=google');
  if (user.id) {
    // Usuario existente paciente: iniciar sesión
    req.session.user = user;
    return res.redirect('/turnos');
  }
  // Usuario nuevo: completar registro de paciente
  const email = user.username;
  return res.redirect(`/registro/paciente?googleEmail=${encodeURIComponent(email)}`);
})

// Registro público de paciente (sin autenticación)
router.post('/register-paciente-public', authController.registerPacientePublic)
export default router;