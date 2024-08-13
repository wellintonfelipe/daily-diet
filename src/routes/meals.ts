import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const tables = await knex('meals').select('*')
    return { tables }
  })

  app.post('/', async () => {
    const tables = await knex('meals').insert({
      id: crypto.randomUUID(),
      name: 'Arroz',
      description: 'Arroz a Carbonara',
      date_time: Date.now(),
      is_on_diet: true,
    })

    return { tables }
  })
}

/** Tabela de Refeições
 * name
 * description
 * date_time
 * is_on_diet
 */
