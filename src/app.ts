import * as express from "express";
import * as session from "express-session";
import * as passport from "passport";
import { getUser, getForms } from "./api";
import { OAuth2User } from "./types";

// Set specific type for req.user
declare global {
  namespace Express {
    interface User extends OAuth2User {}
  }
}

const { SESSION_SECRET } = process.env;

export const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

// load auth config
require("./auth");

app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/auth/trackdechets", passport.authenticate("oauth2"));

app.get(
  "/auth/trackdechets/callback",
  passport.authenticate("oauth2", {
    failureRedirect: "/"
  }),
  (_req, res) => {
    return res.redirect("/dashboard");
  }
);

app.get("/dashboard", async (req, res) => {
  if (!req.user) {
    return res.redirect("/");
  } else {
    const user = await getUser(req.user.token);
    const forms = await getForms(req.user.token);
    return res.render("dashboard", { user, forms });
  }
});

app.listen(process.env.PORT || 3000);
