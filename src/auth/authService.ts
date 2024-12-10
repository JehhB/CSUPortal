const LOGIN_ENDPOINT = "https://takay.csucarig.edu.ph/auth/login";
const LOGOUT_ENDPOINT = "https://takay.csucarig.edu.ph/auth/logout";
const CHANGE_PASSWORD_ENDPOINT = "https://takay.csucarig.edu.ph/ChangePassword";

export type LoginCredentials = {
  id: string;
  password: string;
};

export type LoginResponse =
  | { error: string }
  | { access_token: string; token_type: string; expires_in: number };

export type ChangePasswordResponse = {
  msg: string;
};

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class InvalidPasswordError extends AuthenticationError {
  constructor() {
    super("Incorrect Password");
    this.name = "InvalidPasswordError";
  }
}

const authService = {
  async login({ id, password }: LoginCredentials) {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserID: id, Password: password }),
    });

    if (res.status === 401) {
      throw new AuthenticationError("Invalid credentials");
    }

    const data: LoginResponse = await res.json();
    if ("error" in data) throw new Error(data.error);

    return data;
  },

  async logout(accessToken: string | undefined) {
    if (accessToken === undefined) return;

    await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },

  async changePassword(
    accessToken: string | undefined,
    oldPassword: string,
    newPassword: string,
  ) {
    if (accessToken === undefined) return;

    const payload = JSON.stringify({
      oldPassword,
      password: newPassword,
      password1: null,
      password2: newPassword,
    });

    const resp = await fetch(CHANGE_PASSWORD_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: payload,
    });

    if (!resp.ok) {
      throw new AuthenticationError(
        "Unknown error encountered changing password",
      );
    }

    const data: ChangePasswordResponse = await resp.json();

    if (data.msg === "Password successfully updated.") return;
    if (data.msg === "Invalid Old Password") throw new InvalidPasswordError();

    throw new AuthenticationError(data.msg);
  },
};

export default authService;
