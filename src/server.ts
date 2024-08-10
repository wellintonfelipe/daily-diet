import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

// Rota para verificar se o servidor esta ativo
app.get('/hello', async () => {
  return { Hello: ' World' }
})

// Routes Users (Usúarios)

app.get('/users', async () => {
  const tables = await knex('users').select('*')
  return { tables }
})

app.post('/users', async () => {
  const tables = await knex('users').insert({
    id: crypto.randomUUID(),
    name: 'Wellinton Felipe',
    email: 'wellinton@e.com.br',
  })

  return { tables }
})

// Routes Meals (Refeição)

app.get('/', async () => {
  const tables = await knex('meals').select('*')
  return { tables }
})

app.get('/meals', async () => {
  const tables = await knex('meals').insert({
    id: crypto.randomUUID(),
    name: 'Arroz',
    description: 'Arroz a Carbonara',
    date_time: new Date(),
  })

  return { tables }
})

app.listen({ port: env.PORT }, () => {
  console.error('Server is running 💜')
})

/** Tabela de Usuarios
 * id
 * name
 * email
 * created_at
 * updated_at
 */

/** Tabela de Refeições
 * name
 * description
 * date_time
 * is_on_diet
 */
