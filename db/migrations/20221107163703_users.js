/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('users', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
		table.string('avatar').notNullable();
		table.string('fullname').notNullable();
		table.string('email').notNullable().unique();
		table.string('password').notNullable();
		table.string('pin').notNullable();
		table.string('phone').notNullable();
		table.string('account_no').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('users');
};
