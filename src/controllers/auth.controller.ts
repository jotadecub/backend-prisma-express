import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../lib/prisma";
import { error } from "node:console";

// Helpers para generar el token
const generateToken = (userId: number, role: string): string => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' } // valor fijo en lugar de la variable de entorno
  )
}

// Registro
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body

        if (!email || !password || !name) {
            res.status(400).json({ error: 'Todos los campos son requeridos.'})
            return
        }

        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({ where: { email, } })
        if (existingUser) {
            res.status(400).json({ error: 'El email ya está registrado' })
            return
        }

        // Encriptar la contraseña - Nunca se guarda en texto plano
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
            // Nunca devolvemos la contraseña en la respuesta
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        })
        
        const token = generateToken(user.id, user.role)

        res.status(201).json({ user, token })
    } catch {
        res.status(500).json({ error: 'Error al registrar el usuario' })
    }
}

// Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ error: 'Email y contraseña son requeridos' })
            return
        }

        // Buscar el usuario
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            // Mensaje genérico - No se decimos si el email existe o no
            res.status(401).json({ error: 'Credenciales incorrectas' })
            return
        }

        // Comparar contraseña con el hash guardado
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Credenciales incorrectas' })
            return
        }

        const token = generateToken(user.id, user.role)

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        })
    } catch {
        res.status(500).json({ error: 'Error al iniciar sesion' })
    }
}

// Perfil
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
        })
        
        res.json(user)
    } catch {
        res.status(500).json({ error: 'Error al obtener el perfil' })
    }
}