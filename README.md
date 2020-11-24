# BrackeysBot v4

## Building

Once you pulled the project, you will first need to install the dependancies. The project uses `gulp` to manage the build process. Possible serving tasks are `dashboard` or `bot`, dependng on what you want to run.

```bash
npm install

gulp dashboard
<or>
gulp bot
```

You can also just run `gulp` to perform a full build of the project.

The gulp tasks use `nodemon` to automatically refresh the application on code change.

> If you get any errors about gulp or typescript not being installed, try installing their respective CLI tools globally via `npm`.

## Configuration

The project uses a `.env` file at the project root to store secret tokens.

| Config Value | Description |
|:--|:--|
| `DB_HOST` | The host string of the database. (default: `localhost`) |
| `DB_USER` | The name of the user to access the database with. (default: `root`) |
| `DB_PASSWORD` | The password to access the database with. |
| `DB_SCHEMA` | The database schema to access. (default: `brackeysbot`)
| `BOT_TOKEN` | The token to start the Discord bot with.
| `DASHBOARD_CLIENT_ID` | The client ID to use for the OAuth process in the dashboard. |
| `DASHBOARD_CLIENT_SECRET` | The client secret to use for the OAuth process in the dashboard. |

## Database

The bot uses a MySQL database, interacting with it via knex, hence the knexfile in the project root. To keep the database structure consistent across devices, we use migrations. To update to the latest migration, simply use `npm run migrate`.

## License

This project is licensed under a MIT license.
