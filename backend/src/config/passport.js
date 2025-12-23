const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/user.model");

/* =========================
   GOOGLE STRATEGY
========================= */
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(null, false);

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        avatar: profile.photos?.[0]?.value,
                        providers: {
                            google: {
                                id: profile.id,
                            },
                        },
                        lastLoginAt: new Date(),
                    });
                } else {
                    user.providers.google = {
                        id: profile.id,
                    };

                    user.lastLoginAt = new Date();
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

/* =========================
   DISCORD STRATEGY
========================= */
passport.use(
    new DiscordStrategy(
        {
            clientID: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            callbackURL: "/auth/discord/callback",
            scope: ["identify", "email"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.email;
                if (!email) return done(null, false);

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.username,
                        avatar: profile.avatar
                            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                            : null,
                        providers: {
                            discord: {
                                id: profile.id,
                                username: profile.username,
                                discriminator: profile.discriminator,
                            },
                        },
                        lastLoginAt: new Date(),
                    });
                } else {
                    user.providers.discord = {
                        id: profile.id,
                        username: profile.username,
                        discriminator: profile.discriminator,
                    };

                    user.lastLoginAt = new Date();
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

module.exports = passport;
