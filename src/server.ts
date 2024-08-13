import fastify from 'fastify'
import { env } from './env'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

const app = fastify()

// Rota para verificar se o servidor esta ativo
app.get('/hello', async () => {
  return { Hello: ' World' }
})

// Routes Users (Usúarios)
app.register(usersRoutes, {
  prefix: 'users',
})

// Routes Meals (Refeição)
app.register(mealsRoutes, {
  prefix: 'meals',
})

app.listen({ port: env.PORT }, () => {
  console.error('Server is running 💜')
})
