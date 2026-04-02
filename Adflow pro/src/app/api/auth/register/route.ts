<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { createUser, emailExists, generateToken } from '@/lib/auth';
import { badRequest, serverError } from '@/lib/middleware';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
  } catch (error) {
    console.error('Register error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Registration failed';
    return serverError(errorMsg);
  }
}
=======
import { NextRequest, NextResponse } from 'next/server';
import { createUser, emailExists, generateToken } from '@/lib/auth';
import { badRequest, serverError } from '@/lib/middleware';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
  } catch (error) {
    console.error('Register error:', error);
    const errorMsg = error instanceof Error ? error.message : 'Registration failed';
    return serverError(errorMsg);
  }
}
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
