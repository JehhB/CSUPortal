const LOGIN_ENDPOINT = "https://takay.csucarig.edu.ph/auth/login";
const LOGOUT_ENDPOINT = "	https://takay.csucarig.edu.ph/auth/logout";

export type LoginCredentials = {
  id: string;
  password: string;
};

export type LoginResponse =
  | { error: string }
  | { access_token: string; token_type: string; expires_in: number };

const authService = {
  async login({ id, password }: LoginCredentials) {
    return fetch(LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ UserID: id, Password: password }),
    }).then((res) => {
      if (!res.ok) throw Error("Cannot login");
      return res.json() as Promise<LoginResponse>;
    });
  },
  async logout(accessToken: string) {
    return fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  },
};

export default authService;
