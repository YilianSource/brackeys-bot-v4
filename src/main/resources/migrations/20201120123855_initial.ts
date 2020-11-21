import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('audit_log', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').notNullable();
            table.timestamp('date', { useTz: false }).notNullable();
            table.integer('infraction_id').nullable().defaultTo(null);
            table.string('description').notNullable();
            table.bigInteger('user_id').nullable().defaultTo(null);
        })
        .createTable('infractions', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').notNullable();
            table.timestamp('date', { useTz: false }).notNullable();
            table.string('reason').notNullable();
            table.integer('moderation_type').notNullable();
            table.bigInteger('target_user_id').notNullable();
            table.bigInteger('moderator_user_id').notNullable();
        })
        .createTable('temporary_infractions', function(table) {
            table.increments('id').primary();
            table.integer('infraction_id').notNullable();
            table.timestamp('expires_at', { useTz: false }).notNullable();
        })
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').notNullable();
            table.bigInteger('discord_id').notNullable();
            table.integer('endorsements').defaultTo(0);
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('audit_log')
        .dropTable('infractions')
        .dropTable('temporary_infractions')
        .dropTable('users');
}