import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable('users', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').unsigned().notNullable();
            table.bigInteger('discord_id').unsigned().notNullable();
            table.json('data').nullable().defaultTo(null);
        })
        .createTable('infractions', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').unsigned().notNullable();
            table.timestamp('date', { useTz: false }).notNullable();
            table.string('reason').notNullable();
            table.integer('moderation_type').notNullable();
            table.integer('target_user_id').unsigned().notNullable().references('id').inTable('users');
            table.integer('moderator_user_id').unsigned().notNullable().references('id').inTable('users');
        })
        .createTable('user_notes', function(table) {
            table.increments('id');
        })
        .createTable('audit_log', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').unsigned().notNullable();
            table.timestamp('date', { useTz: false }).notNullable();
            table.integer('infraction_id').unsigned().nullable().defaultTo(null).references('id').inTable('infractions');
            table.string('description').notNullable();
            table.integer('user_id').unsigned().nullable().defaultTo(null).references('id').inTable('users');
        })
        .createTable('temporary_infractions', function(table) {
            table.increments('id').primary();
            table.integer('infraction_id').notNullable().references('id').inTable('infractions');
            table.timestamp('expires_at', { useTz: false }).notNullable();
        })
        .createTable('server_settings', function(table) {
            table.increments('id').primary();
            table.bigInteger('server_id').unsigned().unique().notNullable();
            table.json('settings').nullable().defaultTo(null);
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable('audit_log')
        .dropTable('infractions')
        .dropTable('temporary_infractions')
        .dropTable('users').
        dropTable('server_settings');
}