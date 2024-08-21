import { NextResponse, NextRequest } from 'next/server';

// Simulating an in-memory user database
let users = [
  {
    id: 1,
    email: 'a@a.t',
    password: '12345678',
  },
];

export async function GET() {
    return NextResponse.json(users, { status: 200 });
  }

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required' },
      { status: 400 }
    );
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  const newUser = {
    id: users.length + 1,
    email,
    password, // In a real application, make sure to hash passwords
  };

  users.push(newUser);

  return NextResponse.json(newUser, { status: 201 });
}
