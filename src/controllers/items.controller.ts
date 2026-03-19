import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { error } from "node:console";

// GET /items - Traer todos
export const getItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.item.findMany({
            orderBy: { createdAt: 'desc'}
        })
        res.json(items)
    } catch {
        res.status(500).json({ error: 'Error al obtener los items' })
    }
}

// GET /items/:id - Traer uno
export const getItemById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const item = await prisma.item.findUnique({
            where: { id: Number(id) }
        })

        if (!item) {
            res.status(404).json({ error: 'Item no encontrado' })
            return
        }

        res.json(item)
    } catch {
        res.status(500).json({ error: 'Error al obtener el item' })
    }
}

// POST /items - Crear uno
export const createItem = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body

        if (!name) {
            res.status(400).json({ error: 'El nombre es requerido' })
            return
        }

        const item = await prisma.item.create({
            data: { name, description }
        })

        res.status(201).json(item)
    } catch {
        res.status(500).json({ error: 'Error al crear item' })
    }
}

// PUT /items/:id - Actualizar uno
export const updateItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { name, description } = req.body

        const item = await prisma.item.update({
            where: { id: Number(id) },
            data: { name, description }
        })

        res.json(item)
    } catch {
        res.status(500).json({ error: 'Error al actualizar item' })
    }
}

// DELETE /items/:id - Eliminar uno
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.item.delete({
            where: { id: Number(id) }
        })

        res.json({ message: 'Item eliminado correctamente' })
    } catch {
        res.json({ error: 'Error al eliminar el item' })
    }
}