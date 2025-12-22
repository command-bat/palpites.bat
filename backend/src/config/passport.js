const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/user.model");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (_a, _r, profile, done) => {
            const email = profile.emails[0].value;

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value,
                    providers: { google: true },
                });
            } else {
                user.providers.google = true;
                await user.save();
            }

            done(null, user);
        }
    )
);

passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: "/auth/discord/callback",
            scope: ["identify", "email"],
        },
        async (_a, _r, profile, done) => {
            const email = profile.email;

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email,
                    name: profile.username,
                    avatar: profile.avatar
                        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                        : null,
                    providers: { discord: true },
                });
            } else {
                user.providers.discord = true;
                await user.save();
            }

            done(null, user);
        }
    )
);

module.exports = passport;
