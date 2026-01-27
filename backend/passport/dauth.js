import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import axios from "axios";
import User from "../models/User.js";

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://auth.delta.nitt.edu/authorize",
      tokenURL: "https://auth.delta.nitt.edu/api/oauth/token",
      clientID: process.env.DAUTH_CLIENT_ID,
      clientSecret: process.env.DAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/dauth/callback",
      scope: ["openid", "email", "profile", "user"]
    },
    async (accessToken, refreshToken, params, done) => {
      try {
        const { data } = await axios.post(
          "https://auth.delta.nitt.edu/api/resources/user",
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const { email, name } = data;

        const rollRegex = /^\d{6,9}@nitt\.edu$/;
        const role = rollRegex.test(email) ? "student" : "professor";

        const user = await User.findOneAndUpdate(
          { email },
          { name, email, role },
          { upsert: true, new: true }
        );

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
