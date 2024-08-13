/* eslint-disable */


// D  Definição de Tipos

import { Knex } from 'knex'


declare module 'knex/types/tables'{
    export interface Tables{
        users: {
            id: string
            name: string
            email: string
            created_at: string
            updated_at: string
        }

        meals: {
            id: string
            name: string
            description: string
            date_time: string
            is_on_diet: string
            created_at: string
            updated_at: string
            user_id: string
        }
    }
}


/** Tabela de Refeições
 * name
 * description
 * date_time
 * is_on_diet
 *
 * ========================
 *  Tabela de Usuarios
 * id
 * name
 * email
 * created_at
 * updated_at
 */