import express from 'express';
import cookieSessions from 'cookie-session';
import cookieParser from 'cookie-parser';
import path from 'path';

import * as OAuth from './oauth';

import indexRoute from './routes/index';

require('dotenv').config({ path: path.join(process.cwd(), ".env") });

const app = express();

const cookieSecret = process.env.DASHBOARD_COOKIE_SECRET || 'keyboard cat';
app.use(cookieParser(cookieSecret));
app.use(cookieSessions({
    keys: ['token '],
    secret: cookieSecret
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

OAuth.apply(app);

app.get('/supersecret', function (req, res)
{
    res.end(req.user ? JSON.stringify(req.user) : 'Must be logged in!');
});

app.use('/', indexRoute);
app.listen(parseInt(process.env.DASHBOARD_PORT || '3001'));