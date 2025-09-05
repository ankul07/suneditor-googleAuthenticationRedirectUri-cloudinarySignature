import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.schema.js";
// console.log(process.env.GOOGLE_CLIENT_ID);

// Google OAuth Strategy (ONLY FOR GOOGLE AUTHENTICATION)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // User exists, update last login and login count
          existingUser.lastLogin = new Date();
          existingUser.loginCount += 1;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Check if user exists with same email but different auth method
        let userWithEmail = await User.findOne({
          email: profile.emails[0].value,
        });

        if (userWithEmail) {
          // Link Google account to existing user
          userWithEmail.googleId = profile.id;
          userWithEmail.authProvider = "both";
          userWithEmail.profilePicture =
            userWithEmail.profilePicture || profile.photos[0]?.value;
          userWithEmail.isVerified = true;
          userWithEmail.lastLogin = new Date();
          userWithEmail.loginCount += 1;
          await userWithEmail.save();
          return done(null, userWithEmail);
        }

        // Create new user
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: "google",
          profilePicture: profile.photos[0]?.value,
          isVerified: true, // Google users are automatically verified
          lastLogin: new Date(),
          loginCount: 1,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        // console.error("Google OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

// No serialization needed for JWT-based auth

export default passport;
