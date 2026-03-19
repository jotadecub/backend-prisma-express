import { Router } from "express";
import { getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem 
} from "../controllers/items.controller"; 

const router = Router()

// Cada ruta apunta a su controlador
router.get('/', getItems)
router.get('/:id', getItemById)
router.post('/', createItem)
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

export default router