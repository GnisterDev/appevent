import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";
import { LoginRequest, SignupRequest } from "./User";
import AuthResult from "./AuthResult";
import { DatabaseService } from "./DatabaseService";

class AuthService {
  public static signup(data: SignupRequest): AuthResult {
    return new AuthResult(
      createUserWithEmailAndPassword(auth, data.email, data.password).then(
        userCredential => {
          return DatabaseService.createUser({
            name: data.name,
            email: data.email,
            userID: userCredential.user.uid,
            type: "user",
          });
        }
      )
    );
  }

  public static login(data: LoginRequest): AuthResult {
    return new AuthResult(
      signInWithEmailAndPassword(auth, data.email, data.password).then(() => {})
    );
  }

  public static logout(): AuthResult {
    return new AuthResult(signOut(auth));
  }

  public static async isLoggedIn(): Promise<boolean> {
    return !!auth.currentUser;
  }

  public static getUserID(): string | null {
    return auth.currentUser?.uid || null;
  }

  public static async isAdministrator(): Promise<boolean> {
    new Error("Not implemented");
    return false;
  }
}

export default AuthService;
