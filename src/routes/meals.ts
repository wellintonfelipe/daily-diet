import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  // Criação de refeição

  app.post('/:id', async (request, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const createMealsParamsSchema = z.object({
      name: z.string(),
      description: z.string(),
      dataTime: z.string(),
      isOnDiet: z.enum(['true', 'false']),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const { name, description, dataTime, isOnDiet } =
      createMealsParamsSchema.parse(request.body)

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      date_time: dataTime,
      is_on_diet: isOnDiet,
      user_id: id,
    })

    reply.status(201).send()
  })

  // Burcar refeição do usuario
  app.get('/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where('user_id', id)

    return { meals }
  })

  // Listar uma unica Refeição
  app.get('/first/:id', async (request) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where('user_id', id).first()

    return { meals }
  })

  // Listar quatidade total de refeições de um usuario
  app.get('/amount/:id', async (request) => {
    const getAmountMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getAmountMealsParamsSchema.parse(request.params)

    const meals = await knex('meals')
      .where('user_id', id)
      .count('id', { as: 'Quantidade de Refeições' })
      .first()

    return { meals }
  })

  // Listar quatidade total de refeições dentro da dieta
  app.get('/amount/inside/:id', async (request) => {
    const getAmountInsideMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getAmountInsideMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where({
      user_id: id,
      is_on_diet: 'false',
    })

    return { meals }
  })

  // Listar quatidade total de refeições fora da dieta
  app.get('/amount/outsite/:id', async (request) => {
    const getAmountOutsideMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getAmountOutsideMealsParamsSchema.parse(request.params)

    const meals = await knex('meals').where({
      user_id: id,
      is_on_diet: 'false',
    })

    return { meals }
  })

  app.delete('/:id', async (request, reply) => {
    const deleteMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = deleteMealsParamsSchema.parse(request.params)

    await knex('meals').where('id', id).del()

    return reply.status(204).send()
  })

  app.patch('/:id', async (request, reply) => {
    const patchMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = patchMealsParamsSchema.parse(request.params)

    const updateMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.enum(['true', 'false']),
    })
    const data = updateMealsBodySchema.parse(request.body)

    await knex('meals').where({ id }).update({
      name: data.name,
      description: data.description,
      is_on_diet: data.isOnDiet,
      updated_at: knex.fn.now(),
    })

    return reply.status(204).send()
  })
}

/** Tabela de Refeições
 * name
 * description
 * date_time
 * is_on_diet
 */
