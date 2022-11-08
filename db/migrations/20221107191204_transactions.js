/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('transactions', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
		table.decimal('amount').notNullable();
		table.string('bank').notNullable();
		table.string('account_no').notNullable();
		table.string('account_name').notNullable();
		table.string('description').notNullable();
		table.string('session_id').notNullable();
		table.string('user_id').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('transactions');
};
