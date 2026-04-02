import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.NEXT_PUBLIC_JWT_EXPIRY || '7d';

// Generate JWT Token
export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

// Verify JWT Token
export const verifyToken = (token: string): { userId: string; role: UserRole } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole };
    return decoded;
  } catch (error) {
    return null;
  }
};

// Hash Password
export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

// Compare Passwords
export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

// Create User
export const createUser = async (email: string, password: string, name: string, role: UserRole = 'client') => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash: hashPassword(password),
          name,
          role,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
    return data;
  } catch (err) {
    console.error('Create user error:', err);
    throw err;
  }
};

// Get User by Email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) return null;
  return data as User;
};

// Get User by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as User;
};

// Check if email exists
export const emailExists = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  return !!user;
};

// Check if user has specific role
export const hasRole = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole);
};

// Check if user is admin or super admin
export const isAdmin = (role: UserRole): boolean => {
  return ['admin', 'super_admin'].includes(role);
};

// Check if user is moderator or admin
export const isModerator = (role: UserRole): boolean => {
  return ['moderator', 'admin', 'super_admin'].includes(role);
};
