import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import Result from "./Result";
import { auth } from "./config";
import { LoginRequest, SignupRequest } from "./User";
import databaseService from "./DatabaseService";

class AuthService {
  public signup(
    data: SignupRequest
  ): Result<never, unknown> | Result<UserCredential, Error> {
    try {
      const userCredentialPromise = createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      userCredentialPromise.then(userCredential =>
        databaseService.createUser(
          Promise.resolve({ ...userCredential, displayName: data.name })
        )
      );

      return Result.success(userCredentialPromise);
    } catch (error) {
      return Result.failure(error);
    }
  }

  public login(
    data: LoginRequest
  ): Result<never, unknown> | Result<UserCredential, Error> {
    try {
      const user = signInWithEmailAndPassword(auth, data.email, data.password);
      return Result.success(user);
    } catch (error) {
      return Result.failure(error);
    }
  }

  public logout(): Result<never, unknown> | Result<undefined, Error> {
    try {
      auth.signOut();
      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error);
    }
  }

  public getUserID(): string | null {
    return auth.currentUser?.uid ?? null;
  }

  public isAdministrator(): boolean {
    new Error("Not implemented");
    return false;
  }
}

const authService = new AuthService();

export default authService;
