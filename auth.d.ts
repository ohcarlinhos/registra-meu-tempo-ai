declare module "#auth-utils" {
  interface User {
    name: string;
    email: string;
    hashEmail: string;
  }

  interface UserSession {
    token: string;
  }

  interface SecureSessionData {}
}

export {};
