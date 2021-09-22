import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import jsonwebtoken from "jsonwebtoken";
// modals //
import Admin from "../models/Admin";
import User from "../models/User";
// types //
import type { StrategyOptions } from "passport-jwt";
import type { IUser } from "../models/User";
import type { IAdmin } from "../models/Admin";

export enum StrategyNames {
  AuthStrategy = "AuthStrategy",
  AdminAuthStrategy = "AdminAuthStrategy",
  LoginAuthStrategy = "LoginAuthStrategy"
};

export const issueJWT = (user: IUser): { token: string; expires: string } => {
  const { _id } = user;
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "12hr";
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

  constructor() {
    this.passport = passport;
  }

  public initialize() {
    this.passport.use(StrategyNames.AuthStrategy, new JWTStrategy(this.opts, async (jwtPayload, done) => {
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
    this.passport.use(StrategyNames.AdminAuthStrategy, new JWTStrategy(this.opts, async (jwtPayload, done) => {
      try { 
        const admin = await Admin.findOne({ _id: jwtPayload.sub }).exec();
        if (admin) return done(null, admin);
        else return done(null, false);
      } catch (err) {
        return done (err);
      }
    }));

    this.passport.use(StrategyNames.LoginAuthStrategy, new LocalStrategy({ usernameField: "email", passwordField: "password"}, async (email, pass, done) => {
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
