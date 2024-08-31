// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { db } from '../../../db';
import { student as studentSchema } from '../../../schema';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';  // You should store this in your .env.local file

export default async function login(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Find the student by email
  const student = await db
    .select(studentSchema)
    .where(studentSchema.email.eq(email))
    .first();

  if (!student) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Compare the password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, student.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { id: student.id, email: student.email }, // Payload
    JWT_SECRET,  // Secret key
    { expiresIn: '1h' }  // Token expiration
  );

  // Set the token in an HTTP-only cookie
  res.setHeader('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  // Send cookie only over HTTPS in production
    maxAge: 3600,  // 1 hour in seconds
    path: '/',
  }));

  // Respond with success and student info
  res.status(200).json({ message: 'Login successful', student });
}
