import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import jsonwebtoken from "jsonwebtoken";
// modals //
import Admin from "../models/Admin";
import User from "../models/User";
// helpers //
import { AuthNotFoundError, AuthNotLoggedInError } from "./_helpers/errorHelperts";
// types //
import type { StrategyOptions } from "passport-jwt";
import type { IUser } from "../models/User";
import type { IAdmin } from "../models/Admin";

export enum StrategyNames {
  AuthStrategy = "AuthStrategy",
  AdminAuthStrategy = "AdminAuthStrategy",
  LoginAuthStrategy = "LoginAuthStrategy",
  CheckUserStrategy = "CheckUserStrategy"
};

export const issueJWT = (user: IUser | IAdmin): { token: string; expires: string } => {
  const { _id } = user;
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = "12h";
  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000)
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
            console.log("Should be here")
            return done(new AuthNotFoundError("Invalid Login", [ "No account with provided login exists" ]), false, { message: "Not found" });
          }
        }
      } catch (err) {
        return done(err);
      }
    }));
    this.passport.use(StrategyNames.AdminAuthStrategy, new JWTStrategy(this.opts, async (jwtPayload, done) => {
      try { 
        const admin: IAdmin = await Admin.findOne({ _id: jwtPayload.sub }).exec();
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
            // no <User> or <Admin> model found //
            // 
            console.log("we here")
            return done(new AuthNotFoundError("Invalid Login", [ "No account with provided login exists" ]), false, { message: "Not found" });
          }
        }
      } catch (error) {
        return done(error);
      }
    }));

    this.passport.use(StrategyNames.CheckUserStrategy, new JWTStrategy(this.opts, async (jwtPayload, done) => {
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
        console.log(err);
        return done(err);
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
