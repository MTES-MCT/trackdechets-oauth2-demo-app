import * as passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import { OAuth2User } from "./types";
import { findUserByEmail, saveUser } from "./users";

const {
  AUTHORIZATION_URL,
  TOKEN_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL
} = process.env;

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: AUTHORIZATION_URL,
      tokenURL: TOKEN_URL,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL
    },
    (accessToken, _refreshToken, results, _profile, verified) => {
      const user = {
        token: accessToken,
        ...results.user
      };
      saveUser(user);
      return verified(null, user);
    }
  )
);

passport.serializeUser<OAuth2User, string>((user, done) => {
  done(null, user.email);
});

passport.deserializeUser<OAuth2User, string>((id, done) => {
  const user = findUserByEmail(id);
  return done(null, user);
});
