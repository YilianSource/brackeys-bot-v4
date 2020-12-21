import Knex from 'knex';
import { join } from 'path';
import {ServerSettings} from './server_settings'

export const knex: Knex = require('knex')(require(join(process.cwd(), 'knexfile')));

export const getUser = function(id: bigint): Promise<any> {
    return knex('users').where({id: id}).first();
}

// export const getGuildPrefix = function(guildId: bigint): string {
//     let settingsJson = knex('server_settings').where({server_id: guildId}).first().then(data => data) || {};
//     let settings = new ServerSettings().deserialize();
//
//     return settings.prefix || '!';
// }

export const getGuildSettings = function(guildId: bigint): Promise<ServerSettings> {
    return knex('server_settings')
        .where({server_id: guildId})
        .first()
        .then((data) => new ServerSettings().deserialize(data.settings));
}

export const setGuildSettings = function(guildId: bigint, settings: ServerSettings): Promise<any> {
    return knex('server_settings')
        .where({server_id: guildId})
        .update({settings: settings.serialize()})
}

export const injectGuildPrefix = function(guildId: bigint) {
    let settings = new ServerSettings();
    settings.prefix = '!';
    knex('server_settings')
        .insert({
            server_id: guildId,
            settings: settings.serialize()
        })
        .then();
}