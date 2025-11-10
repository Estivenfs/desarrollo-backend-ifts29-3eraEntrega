import mongoose from 'mongoose';

// --- Esquema de Paciente ---
const pacienteSchema = new mongoose.Schema({
    DNI: { type: String, required: true, unique: true },
    Nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    Apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minlength: [2, 'El apellido debe tener al menos 2 caracteres']
    },
    Edad: {
        type: Number,
        required: [true, 'La edad es obligatoria'],
        min: [0, 'La edad debe ser mayor o igual a 0']
    },
    Sexo: {
        type: String,
        required: [true, 'El sexo es obligatorio'],
        enum: ['M', 'F'],
        message: '{VALUE} no es un sexo válido. Debe ser M o F.'
    },
    ObraSocial: {
        type: String,
        required: [true, 'La obra social es obligatoria'],
        minlength: [3, 'La obra social debe tener al menos 3 caracteres']
    },
    NroAfiliado: {
        type: String,
        required: [true, 'El número de afiliado es obligatorio'],
        minlength: [3, 'El número de afiliado debe tener al menos 3 caracteres']
    },
    // Otros campos de paciente
}, {
    timestamps: true // Añade campos createdAt y updatedAt
});

// --- Esquema de Médico ---
const medicoSchema = new mongoose.Schema({
    DNI: { type: String, required: true, unique: true },
    Nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    Apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        minlength: [2, 'El apellido debe tener al menos 2 caracteres']
    },
    Especialidad: {
        type: String,
        required: [true, 'La especialidad es obligatoria'],
        minlength: [3, 'La especialidad debe tener al menos 3 caracteres']
    },
    // Otros campos de médico
}, {
    timestamps: true
});

// --- Esquema de Turno ---
const turnoSchema = new mongoose.Schema({
    IdPaciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true }, // Referencia al Paciente
    IdMedico: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', required: true },     // Referencia al Médico
    Fecha: { type: Date, required: true },
    HoraInicio: { type: String, required: true },
    HoraFin: { type: String, required: true },
}, {
    timestamps: true
});

// --- Esquema de Usuario ---
const usuarioSchema = new mongoose.Schema({
    Username: { type: String, required: true, unique: true, trim: true },
    PasswordHash: { type: String, required: true },
    Role: { type: String, required: true, enum: ['Administrativo', 'Medico', 'Paciente'] },
    MedicoRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Medico', default: null },
    PacienteRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', default: null }
}, { timestamps: true });

// Crear los modelos
export const Paciente = mongoose.model('Paciente', pacienteSchema);
export const Medico = mongoose.model('Medico', medicoSchema);
export const Turno = mongoose.model('Turno', turnoSchema);
export const Usuario = mongoose.model('Usuario', usuarioSchema);

// Mapeo para facilitar el acceso en el servicio
export const Models = {
    pacientes: Paciente,
    medicos: Medico,
    turnos: Turno,
    usuarios: Usuario,
};