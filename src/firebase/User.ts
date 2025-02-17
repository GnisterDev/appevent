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
  type: "admin" | "user";
  userID: string;
};

export type UserData = {
  name: string | null;
  email: string | null;
  type: string | null;
};
