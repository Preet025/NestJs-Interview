import { ROLE } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      email: string;
      role: ROLE;
    }

    interface Request {
      user: User;
    }
  }
}
