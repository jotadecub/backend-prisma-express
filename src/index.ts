import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import itemsRoutes from './routes/items.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' })
})

// Todas las rutas de items bajo /items
app.use('/items', itemsRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})