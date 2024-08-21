import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

interface Todo {
  id: number;
  userId: number;
  text: string;
  completed: boolean;
}

const todos: Todo[] = [];

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  const userTodos = todos.filter(todo => String(todo.userId) === session.user.id);

  return new Response(JSON.stringify(userTodos), { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  const { text } = await request.json();

  if (!text) {
    return new Response(JSON.stringify({ message: 'Text is required' }), { status: 400 });
  }

  const newTodo: Todo = {
    id: todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
    userId: Number(session.user.id),
    text,
    completed: false
  };

  todos.push(newTodo);

  return new Response(JSON.stringify(newTodo), { status: 201 });
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: 'Not authenticated' }), {
        status: 401,
      });
    }
  
    const { id, text, completed } = await request.json();
  
    if (id == null || text == null || completed == null) {
      return new Response(JSON.stringify({ message: 'ID, text, and completed status are required' }), {
        status: 400,
      });
    }
  
    const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === Number(session.user.id));
  
    if (todoIndex === -1) {
      return new Response(JSON.stringify({ message: 'Todo not found or not authorized' }), {
        status: 404,
      });
    }
  
    todos[todoIndex] = { ...todos[todoIndex], text, completed };
  
    return new Response(JSON.stringify(todos[todoIndex]), {
      status: 200,
    });
  }
  

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
  }

  const { id } = await request.json();

  if (id == null) {
    return new Response(JSON.stringify({ message: 'ID is required' }), { status: 400 });
  }

  const todoIndex = todos.findIndex(todo => todo.id === id && todo.userId === Number(session.user.id));

  if (todoIndex === -1) {
    return new Response(JSON.stringify({ message: 'Todo not found or not authorized' }), { status: 404 });
  }

  todos.splice(todoIndex, 1);

  return new Response(JSON.stringify({ message: 'Todo deleted successfully' }), { status: 200 });
}
