import { PrismaClient } from "@prisma/client";
import { deflate } from "node:zlib";

// Creamos una solo instancia de Prisma para toda la app
// Esto evita crear multiples conexiones a la base de datos
const prisma = new PrismaClient()

export default prisma