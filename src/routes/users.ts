import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUsersBobySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    const { name, email } = createUsersBobySchema.parse(request.body)

    await knex('users')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
      })
      .returning('*')

    reply.status(201).send()
  })

  app.get('/', async () => {
    const tables = await knex('users').select('')
    return { tables }
  })
}

/** Tabela de Usuarios
 * id
 * name
 * email
 * created_at
 * updated_at
 */
