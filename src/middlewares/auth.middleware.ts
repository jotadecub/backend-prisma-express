import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { decode } from "node:punycode";

// Extendemos el tipo Request para agregarle userId y role
declare global {
    namespace Express {
        interface Request {
            userId?: number
            userRole?: string
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Token no porporcionado' })
            return
        }

        const token = authHeader.split(' ')[1]

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number
            role: string
        }

        // Agregamos los datos al request para usarlos en los controladores
        req.userId = decoded.userId
        req.userRole = decoded.role

        next() // continua al controlador
    } catch {
        res.status(500).json({ error: 'Token inválido o expirado' })
    }
}

// Middleware para verificar rol de admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.userRole !== 'ADMIN') {
        res.status(401).json({ error: 'No tienes permisos para esta accion' })
        return
    }

    next()
}