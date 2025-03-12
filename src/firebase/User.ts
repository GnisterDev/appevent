interface BaseCredentials {
  password: string;
  email: string;
  name?: string;
}

export type LoginRequest = BaseCredentials;

export type SignupRequest = Required<BaseCredentials>;

export type UserData = {
  name: string;
  email: string;
  type: "admin" | "user";
  userID: string;
  area: string;
  interests: string[];
};

export const DefaultUserData: UserData = {
  name: "",
  email: "",
  type: "user",
  userID: "",
  area: "",
  interests: [],
};
