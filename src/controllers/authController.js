import bcrypt from 'bcryptjs';
import { Models } from '../models/index.js';
import jwt from 'jsonwebtoken';

const authController = {
  async register(req, res) {
    try {
      const { username, password, role, medicoId, pacienteId } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Username, password y role son requeridos' });
      }
      if (!['Administrativo', 'Medico', 'Paciente'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Role inválido' });
      }

      const existing = await Models['usuarios'].findOne({ Username: username });
      if (existing) {
        return res.status(409).json({ success: false, message: 'El usuario ya existe' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await Models['usuarios'].create({
        Username: username,
        PasswordHash: passwordHash,
        Role: role,
        MedicoRef: medicoId || null,
        PacienteRef: pacienteId || null,
      });

      return res.status(201).json({ success: true, message: 'Usuario registrado correctamente', data: { id: newUser._id, username: newUser.Username, role: newUser.Role } });
    } catch (error) {
      console.error('Error en registro:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },
  async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos' });
      }

      const user = await Models['usuarios'].findOne({ Username: username });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const isValid = await bcrypt.compare(password, user.PasswordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      // Datos del usuario para sesión/JWT
      const userPayload = {
        id: user._id,
        username: user.Username,
        role: user.Role,
        medicoId: user.MedicoRef || null,
        pacienteId: user.PacienteRef || null,
      };

      // Guardar en la sesión (compatibilidad con vistas actuales)
      req.session.user = userPayload;

      // Generar JWT
      const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'dev_jwt_secret', {
        expiresIn: '1h'
      });

      return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', data: userPayload, token });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  },

  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
};

export default authController;