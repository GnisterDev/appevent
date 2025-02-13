interface BaseCredentials {
  password: string;
  email: string;
  name?: string;
}

export type LoginRequest = BaseCredentials;

export type SignupRequest = Required<BaseCredentials>;

export type User = {
  name: string;
  email: string;
  userID: string;
  type: "admin" | "user";
};
