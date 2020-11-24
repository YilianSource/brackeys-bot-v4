import { Express } from 'express';
import { Strategy as DiscordStrategy } from 'passport-discord';

import passport from 'passport';

interface OAuthConfiguration {
    failureRedirect?: string;
    authorizeRedirect?: string;
    logoutRedirect?: string;
}

export function apply(app: Express, options: OAuthConfiguration = {}) {
    passport.use(new DiscordStrategy({
        clientID: process.env.DASHBOARD_CLIENT_ID || '',
        clientSecret: process.env.DASHBOARD_CLIENT_SECRET || '',
        callbackURL: `http://localhost:${parseInt(process.env.DASHBOARD_PORT || '3001')}/auth/discord/callback`,
        scope: [ 'identify' ]
    }, function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }));

    // TODO: Implement user fetching
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(id, done) {
        done(null, id);
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.user = req.user;
        next();
    });

    app.get('/auth/discord', passport.authenticate('discord'));
    app.get('/auth/discord/callback', passport.authenticate('discord', {
        failureRedirect: options.failureRedirect || '/'
    }), function(req, res) {
        res.redirect(options.authorizeRedirect || '/');
    });
    app.get('/auth/logout', function(req, res) {
        (req.session as any).passport = null;
        res.redirect(options.logoutRedirect || '/');
    });
}