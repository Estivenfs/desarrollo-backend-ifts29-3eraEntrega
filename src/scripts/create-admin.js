import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import { Models } from '../models/index.js';

dotenv.config();

(async () => {
  try {
    await connectDB();

    const username = 'admin';
    const plainPassword = 'admin';
    const role = 'Administrativo';

    const existing = await Models['usuarios'].findOne({ Username: username });
    if (existing) {
      console.log(`ℹ️  El usuario '${username}' ya existe (id: ${existing._id}). No se realizaron cambios.`);
      await mongoose.connection.close();
      process.exit(0);
      return;
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const newUser = await Models['usuarios'].create({
      Username: username,
      PasswordHash: passwordHash,
      Role: role,
      MedicoRef: null,
      PacienteRef: null,
    });

    console.log(`✅ Usuario administrador creado correctamente:`);
    console.log(`   - id: ${newUser._id}`);
    console.log(`   - username: ${newUser.Username}`);
    console.log(`   - role: ${newUser.Role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error);
    try { await mongoose.connection.close(); } catch {}
    process.exit(1);
  }
})();