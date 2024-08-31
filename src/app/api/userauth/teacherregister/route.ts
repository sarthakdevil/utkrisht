import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../db'; // Ensure this is your Drizzle instance
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { teacher } from '../../../schema'; // Import your Drizzle schema model
import { registrationSchema } from '../../../lib/validation'; // Import your Zod schema
import cookie from 'cookie'; // Use 'cookie' to handle cookies

// Define the number of salt rounds for bcrypt
const saltRounds = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!; // Ensure this is set in your .env.local file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the JSON body
    const body = req.body;

    // Validate input data using Zod
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid input', errors: parsed.error.errors });
    }

    const { name, email, password, teacher_id, specialization } = parsed.data;

    // Check if user already exists
    const existingTeacher = await db
      .select()
      .from(teacher)
      .where(teacher.email.eq(email))
      .single();

    if (existingTeacher) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    await db.insert(teacher).values({
      name,
      email,
      password: hashedPassword,
      teacher_id,
      specialization,
      createdAt: new Date(),
    });

    // Create JWT token
    const token = jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: '1h' });

    // Set JWT as a cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 24 * 30, // 1 month
        path: '/',
      })
    );

    return res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Error in registration' });
  }
}
