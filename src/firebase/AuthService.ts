import {
  AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Result from "./Result";
import { auth } from "./config";
import { LoginRequest, SignupRequest } from "./User";

class AuthService {
  public signup(data: SignupRequest) {
    try {
      const user = createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("user", user);
      return Result.success(user);
    } catch (error: unknown) {
      console.log("error", error);
      return Result.failure(error as AuthError);
    }
  }

  public login(data: LoginRequest) {
    try {
      const user = signInWithEmailAndPassword(auth, data.email, data.password);
      return Result.success(user);
    } catch (error: unknown) {
      return Result.failure(error as AuthError);
    }
  }

  public logout() {
    try {
      auth.signOut();
      return Result.success(null);
    } catch (error: unknown) {
      return Result.failure(error as AuthError);
    }
  }

  public isAdministrator() {
    new Error("Not implemented");
  }

  public getUserID() {
    new Error("Not implemented");
  }
}

const authService = new AuthService();

export default authService;
