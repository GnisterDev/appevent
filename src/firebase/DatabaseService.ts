import { UserCredential } from "firebase/auth";
import { db } from "./config";
import { doc, setDoc } from "firebase/firestore";

class DatabaseService {
  public async createUser(
    userInfo: Promise<UserCredential & { displayName: string }>
  ) {
    const userCredential = await userInfo;
    const user = userCredential.user;
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name: (await userInfo)?.displayName,
        email: user?.email,
        role: "user",
      });
    }
  }
}

const databaseService = new DatabaseService();

export default databaseService;
