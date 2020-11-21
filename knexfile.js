require('dotenv').config();

module.exports = {
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_SCHEMA || 'brackeysbot'
    },
    migrations: {
        directory: './dist/main/resources/migrations'
    }
};