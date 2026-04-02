<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { UserRole } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userRole?: UserRole;
}

// Middleware to verify JWT token
export const verifyAuth = (req: NextRequest): { userId: string; role: UserRole } | null => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  return verifyToken(token);
};

// Middleware to check role
export const checkRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Response helpers
export const unauthorized = () => {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
};

export const forbidden = () => {
  return NextResponse.json(
    { success: false, error: 'Forbidden' },
    { status: 403 }
  );
};

export const badRequest = (message: string) => {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 }
  );
};

export const notFound = () => {
  return NextResponse.json(
    { success: false, error: 'Not found' },
    { status: 404 }
  );
};

export const serverError = (message: string) => {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
};

// Validate cron secret
export const verifyCronSecret = (req: NextRequest): boolean => {
  const cronSecret = req.headers.get('X-Cron-Secret');
  return cronSecret === process.env.CRON_SECRET;
};
=======
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { UserRole } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userRole?: UserRole;
}

// Middleware to verify JWT token
export const verifyAuth = (req: NextRequest): { userId: string; role: UserRole } | null => {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  return verifyToken(token);
};

// Middleware to check role
export const checkRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Response helpers
export const unauthorized = () => {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
};

export const forbidden = () => {
  return NextResponse.json(
    { success: false, error: 'Forbidden' },
    { status: 403 }
  );
};

export const badRequest = (message: string) => {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400 }
  );
};

export const notFound = () => {
  return NextResponse.json(
    { success: false, error: 'Not found' },
    { status: 404 }
  );
};

export const serverError = (message: string) => {
  return NextResponse.json(
    { success: false, error: message },
    { status: 500 }
  );
};

// Validate cron secret
export const verifyCronSecret = (req: NextRequest): boolean => {
  const cronSecret = req.headers.get('X-Cron-Secret');
  return cronSecret === process.env.CRON_SECRET;
};
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
