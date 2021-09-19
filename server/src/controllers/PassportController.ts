import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import type { StrategyOptions } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";
// 
import Admin from "../models/Admin";
import User from "../models/User";
import type { IUser } from "../models/User";
import type { IAdmin } from "../models/Admin";

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
  passport: passport.PassportStatic;
  private opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }

  constructor({ }) {
    this.passport = passport;
  }

  public initialize() {
    this.passport.use("authStrategy", new JWTStrategy(this.opts, async (jwtPayload, done) => {
      try {
        const admin = await Admin.findOne({ _id: jwtPayload.sub }).exec();
        if (admin) {
          return done(null, admin);
        } else {
          const user = await User.findOne({ _id: jwtPayload.sub }).exec();
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      } catch (err) {
        return done(err);
      }
    }));
    this.passport.use("adminAuthStrategy", new JWTStrategy(this.opts, async (jwtPayload, done) => {
      try { 
        const admin = await Admin.findOne({ _id: jwtPayload.sub }).exec();
        if (admin) return done(null, admin);
        else return done(null, false);
      } catch (err) {
        return done (err);
      }
    }));

    this.passport.use("login", new LocalStrategy({ usernameField: "email", passwordField: "password"}, async (email, pass, done) => {
      try {
        const admin = await Admin.findOne({ email }).exec();
        if (admin) {
          const validLogin = await admin.validPassword(pass);
          if (validLogin) {
            return done(null, admin, { message: "Login ok" });
          } else {
            return done(null, false, { message: "Wrong password" });
          }
        } else {
          const user = await User.findOne({ email }).exec();
          if (user) {
            const validLogin = await user.validPassword(pass);
            if (validLogin) {
              return done(null, user, { message: "Login ok" });
            } else {
              return done(null, false, { message: "Wrong password" });
            }
          } else {
            return done(new Error("User not found"), false, { message: "Not found" });
          }
        }
      } catch (error) {
        return done(error);
      }
    }));
    

    return this.passport;

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
