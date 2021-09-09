import passport, { PassportStatic } from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import type { StrategyOptions } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
// 
import User from "../models/User";
import type { IUser } from "../models/User";

export const issueJWT = (user: IUser): { token: string; expires: string } => {
  const { _id } = user;
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, secretKey, { expiresIn });
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn
  };
};

export default class PassportController {
  private opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }

  public initialize() {
    passport.use(new JWTStrategy(this.opts, async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ _id: jwtPayload.sub }).exec();
        if (user) return done(null, user);
        else return done(null, false);
      } catch (err) {
        return done(err);
      }
    }));

    passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password"}, async (email, pass, done) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validLogin = await user.validPassword(pass);
        if (!validLogin) {
          return done(null, false, { message: "Wrong password" });
        } else {
          return done(null, user, { message: "Login ok" });
        }
      } catch (error) {
        return done(error);
      }
    }));

    return passport;

    /*
    passport.use("register", new LocalStrategy({ usernameField: "email", passwordField: "password"}, async (email, pass done) => {
      try {
        const user = await User.create({ email, password: pass });
      } catch (error) {

      }
    }))
    */
  }

};
