// Middleware personalizado
import express from 'express';
import jwt from 'jsonwebtoken';

// Middleware para logging de requests
export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

// Middleware de autorización: requiere autenticación
export const requireAuth = (req, res, next) => {
    // Si hay sesión, usarla
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }

    // Si no hay sesión, intentar JWT (Authorization: Bearer <token>)
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const token = authHeader.substring('Bearer '.length);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};

// Middleware de autorización: requiere rol específico
export const requireRole = (roles) => (req, res, next) => {
    const user = req.user || (req.session ? req.session.user : null);
    if (!user) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
    }
    const userRole = user.role;
    const allowed = Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
    if (!allowed) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: rol insuficiente' });
    }
    next();
};

// Middleware de autorización para vistas: redirige a /login si no autenticado
export const requireAuthView = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    return res.redirect('/login');
};

// Middleware para manejo de errores
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
};

// Middleware para rutas no encontradas
export const notFound = (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        message: `La ruta ${req.url} no existe`
    });
};