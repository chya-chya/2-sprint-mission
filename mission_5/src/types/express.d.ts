declare global {
  namespace Express {
    interface User {
      id: number;
    }
    interface RequestHandler {
      user?: User;
    }
  }
}

export {};
