const LOGIN_ENDPOINT = "https://takay.csucarig.edu.ph/auth/login";
const LOGOUT_ENDPOINT = "	https://takay.csucarig.edu.ph/auth/logout";

export type LoginCredentials = {
  id: string;
  password: string;
};

export type LoginResponse =
  | { error: string }
  | { access_token: string; token_type: string; expires_in: number };

export class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "AuthenticationError";
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

    if (!res.ok) {
      throw new Error("Unknown error is encountered");
    }

    return res.json() as Promise<LoginResponse>;
  },

  async logout(accessToken: string | undefined) {
    if (accessToken === undefined) return;

    await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export default authService;
