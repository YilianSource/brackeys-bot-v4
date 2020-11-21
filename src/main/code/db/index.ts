import Knex from 'knex';
import { join } from 'path';

export const knex: Knex = require('knex')(require(join(process.cwd(), 'knexfile')));

export const getUser = function(id: bigint): Promise<any> {
    return knex('users').where({id: id}).first();
}