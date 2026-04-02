import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePassword, generateToken } from '@/lib/auth';
import { badRequest, serverError } from '@/lib/middleware';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Login failed';
    return serverError(errorMsg);
  }
}
