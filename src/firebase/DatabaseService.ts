import { doc, getFirestore, setDoc } from "firebase/firestore";
const db = getFirestore();
import Result from "./Result";
import { User } from "./User";

class DatabaseService {
  public async createUser(user: User) {
    try {
      setDoc(doc(db, "users", user.userID), user);
      return Result.success(null);
    } catch (error: unknown) {
      return Result.failure(error as Error);
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
