// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '../../../db';
import { student } from '../../../schema';
import { NextRequest, NextResponse } from 'next/server';

export default async function register(req: NextRequest, res: NextResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, program, email, password } = req.body;

  // Check if the email is already registered
  const existingStudent = await db
    .select(student)
    .where(student.email.eq(email))
    .first();

  if (existingStudent) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new student into the database
  const newStudent = await db
    .insert(student)
    .values({
      name,
      program,
      email,
      password: hashedPassword,
    })
    .returning();

  res.status(201).json({ message: 'Student registered successfully', student: newStudent });
}
