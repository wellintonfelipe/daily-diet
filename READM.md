### Regras da aplicação

[ ] Deve ser possível criar um usuário.
[ ] Deve ser possível identificar o usuário entre as requisições.
[ ] Deve ser possível registrar uma refeição feita, com as seguintes informações:

- [ ] _As refeições devem ser relacionadas a um usuário_.
- [ ] Nome.
- [ ] Descrição.
- [ ] Data e Hora.
- [ ] Está dentro ou não da dieta.

- [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima.
- [ ] Deve ser possível apagar uma refeição.
- [ ] Deve ser possível listar todas as refeições de um usuário.
- [ ] Deve ser possível visualizar uma única refeição.
- Deve ser possível recuperar as métricas de um usuári.

  - [ ] Quantidade total de refeições registradas.
  - [ ] Quantidade total de refeições dentro da dieta.
  - [ ] Quantidade total de refeições fora da dieta.
  - [ ] Melhor sequência de refeições dentro da dieta.

- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou.

### Contexto da aplicação

É comum ao estar desenvolvendo uma API, imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Por isso, deixamos abaixo o link para o layout da aplicação que utilizaria essa API.

# Chat GPT

`Para criar uma aplicação em Node.js com banco de dados usando Knex.js, vou dividir a solução em duas partes principais: a modelagem do banco de dados e as regras da aplicação. Aqui está como você pode estruturá-las:

### 1. Modelagem do Banco de Dados

Vamos criar duas tabelas principais: `users` (usuários) e `meals` (refeições). A tabela de refeições terá uma relação com a tabela de usuários.

#### Tabelas

```js
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.timestamps(true, true); // created_at e updated_at
    })
    .createTable("meals", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.text("description");
      table.dateTime("date_time").notNullable();
      table.boolean("is_on_diet").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Deleta refeições se o usuário for deletado
      table.timestamps(true, true); // created_at e updated_at
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("meals").dropTable("users");
};
```

### 2. Regras da Aplicação

#### a) Criar uma refeição

Um usuário pode criar uma refeição, que será relacionada ao seu ID.

#### b) Editar uma refeição

O usuário pode editar uma refeição específica, desde que seja o criador dela.

#### c) Apagar uma refeição

O usuário pode apagar uma refeição, desde que seja o criador dela.

#### d) Listar todas as refeições de um usuário

Um usuário pode listar todas as refeições que ele criou.

#### e) Visualizar uma única refeição

O usuário pode visualizar os detalhes de uma única refeição que ele criou.

#### f) Recuperar métricas do usuário

Um usuário pode recuperar as seguintes métricas:

- Quantidade total de refeições registradas.
- Quantidade total de refeições dentro da dieta.
- Quantidade total de refeições fora da dieta.
- Melhor sequência de refeições dentro da dieta.

### 3. Implementação em Node.js com Knex.js

#### a) Inserir uma refeição

```js
async function createMeal(userId, mealData) {
  return knex("meals").insert({
    ...mealData,
    user_id: userId,
    date_time: new Date(mealData.date_time),
  });
}
```

#### b) Editar uma refeição

```js
async function updateMeal(userId, mealId, mealData) {
  return knex("meals")
    .where({ id: mealId, user_id: userId })
    .update({
      ...mealData,
      date_time: new Date(mealData.date_time),
      updated_at: knex.fn.now(),
    });
}
```

#### c) Apagar uma refeição

```js
async function deleteMeal(userId, mealId) {
  return knex("meals").where({ id: mealId, user_id: userId }).del();
}
```

#### d) Listar todas as refeições de um usuário

```js
async function listMeals(userId) {
  return knex("meals").where({ user_id: userId }).select("*");
}
```

#### e) Visualizar uma única refeição

```js
async function getMeal(userId, mealId) {
  return knex("meals").where({ id: mealId, user_id: userId }).first();
}
```

#### f) Recuperar métricas de um usuário

```js
async function getUserMetrics(userId) {
  const totalMeals = await knex("meals")
    .where({ user_id: userId })
    .count("* as count")
    .first();

  const onDietMeals = await knex("meals")
    .where({ user_id: userId, is_on_diet: true })
    .count("* as count")
    .first();

  const offDietMeals = await knex("meals")
    .where({ user_id: userId, is_on_diet: false })
    .count("* as count")
    .first();

  // Melhor sequência de refeições dentro da dieta
  const meals = await knex("meals")
    .where({ user_id: userId })
    .orderBy("date_time", "asc")
    .select("is_on_diet");

  let bestStreak = 0,
    currentStreak = 0;
  for (const meal of meals) {
    if (meal.is_on_diet) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    totalMeals: totalMeals.count,
    onDietMeals: onDietMeals.count,
    offDietMeals: offDietMeals.count,
    bestStreak,
  };
}
```

### 4. Restrições e Segurança

- **Autorização**: Certifique-se de que as operações de visualização, edição e exclusão de refeições só podem ser realizadas pelo usuário que as criou.
- **Validação**: Valide os dados antes de inseri-los ou atualizá-los no banco de dados.

Essa implementação básica cobre a criação, edição, exclusão e visualização de refeições, bem como a recuperação de métricas, seguindo as regras e requisitos especificados.`
