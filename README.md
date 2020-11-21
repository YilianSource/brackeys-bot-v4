# BrackeysBot v4

## Building

Once you pulled the project, you will first need to install the dependancies.

```bash
npm i
```

The project uses `gulp` to manage the build process. Running `npm start` will automatically run the gulpfile and start up the main entry point of the application, which includes the bot and the dashboard.

If you get any errors about gulp or typescript not being installed, try installing their respective CLI tools globally via npm.

To configure the access tokens, create a `.env` file in the project root. Here you can configure the DB_HOST, DB_USER, DB_PASSWORD, DB_SCHEMA and the DISCORD_TOKEN.

Once all of this is set up, run `npm start` and the build scripts should handle everything else!

## Database

The bot uses a MySQL database, interacting with it via knex, hence the knexfile in the project root. To keep the database structure consistent across devices, we use migrations. To update to the latest migration, simply use `npm run migrate`.

## License

This project is licensed under a MIT license.
