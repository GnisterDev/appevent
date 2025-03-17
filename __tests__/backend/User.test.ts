import { DefaultUserData, UserData } from "../../src/firebase/User";

describe("UserData Tests", () => {
  it("should have correct default values in DefaultUserData", () => {
    const expectedDefaultUserData: UserData = {
      userID: "",
      name: "",
      email: "",
      type: "user",
      location: "",
      description: "",
      interests: [],
      invitations: [],
    };

    expect(DefaultUserData).toEqual(expectedDefaultUserData);
  });

  it("should have 'user' as the default type in DefaultUserData", () => {
    expect(DefaultUserData.type).toBe("user");
  });

  it("should have an empty array for interests in DefaultUserData", () => {
    expect(DefaultUserData.interests).toEqual([]);
  });

  it("should have an empty array for invitations in DefaultUserData", () => {
    expect(DefaultUserData.invitations).toEqual([]);
  });

  it("should have empty strings for userID, name, email, location, and description in DefaultUserData", () => {
    expect(DefaultUserData.userID).toBe("");
    expect(DefaultUserData.name).toBe("");
    expect(DefaultUserData.email).toBe("");
    expect(DefaultUserData.location).toBe("");
    expect(DefaultUserData.description).toBe("");
  });
});
