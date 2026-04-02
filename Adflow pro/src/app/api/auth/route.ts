import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail, comparePassword, generateToken, emailExists } from '@/lib/auth';
import { badRequest, serverError } from '@/lib/middleware';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = req.nextUrl.pathname;

    if (path.includes('/register')) {
      // Register route
      const result = registerSchema.safeParse(body);
      if (!result.success) {
        return badRequest('Invalid input');
      }

      const { email, password, name } = result.data;

      // Check if email already exists
      if (await emailExists(email)) {
        return badRequest('Email already registered');
      }

      const user = await createUser(email, password, name, 'client');

      const token = generateToken(user.id, user.role);

      return NextResponse.json(
        {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            },
            token,
          },
        },
        { status: 201 }
      );
    } else if (path.includes('/login')) {
      // Login route
      const result = loginSchema.safeParse(body);
      if (!result.success) {
        return badRequest('Invalid email or password');
      }

      const { email, password } = result.data;
      const user = await getUserByEmail(email);

      if (!user || !comparePassword(password, user.password_hash)) {
        return badRequest('Invalid email or password');
      }

      const token = generateToken(user.id, user.role);

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          token,
        },
      });
    }

    return badRequest('Invalid endpoint');
  } catch (error) {
    console.error('Auth error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Authentication failed';
    return serverError(errorMsg);
  }
}
