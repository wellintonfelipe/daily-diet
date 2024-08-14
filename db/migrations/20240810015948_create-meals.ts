import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.dateTime('date_time').notNullable()
    table.string('is_on_diet').defaultTo('true')
    table
      .string('user_id')
      .defaultTo(knex.fn.uuid())
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE') // Deletar a refeição se o usúario for deletado

    table.timestamps(true, true) // created_at e updated_at
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
