"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import { signOut } from "next-auth/react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError('Failed to fetch todos.');
    }
  };

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newTodo }),
        });
        if (response.ok) {
          const addedTodo = await response.json();
          setTodos([...todos, { ...addedTodo, completed: false }]);
          setNewTodo('');
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('Failed to add todo.');
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError('Failed to delete todo.');
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      try {
        const response = await fetch('/api/todos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: updatedTodo.id,
            text: updatedTodo.text,
            completed: updatedTodo.completed,
          }),
        });
        if (response.ok) {
          setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('Failed to toggle todo.');
      }
    }
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id: number) => {
    const updatedTodo = todos.find(todo => todo.id === id);
    if (updatedTodo) {
      try {
        const response = await fetch('/api/todos', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: updatedTodo.id,
            text: editText,
            completed: updatedTodo.completed,
          }),
        });
        if (response.ok) {
          setTodos(todos.map(todo => (todo.id === id ? { ...updatedTodo, text: editText } : todo)));
          setEditingId(null);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (err) {
        setError('Failed to save edit.');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className='h-screen grid content-center justify-center'>
      <div className="max-w-md mx-auto p-4 bg-background shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-primary">Todo List</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="mr-2"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center bg-muted p-2 rounded">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mr-2"
              />
              {editingId === todo.id ? (
                <>
                  <Input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="mr-2 flex-grow"
                  />
                  <Button size="icon" onClick={() => saveEdit(todo.id)} className="mr-1">
                    <CheckIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={cancelEdit} variant="outline">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className={`mr-auto ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {todo.text}
                  </span>
                  <Button size="icon" onClick={() => startEditing(todo.id, todo.text)} className="mr-1">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" onClick={() => deleteTodo(todo.id)} variant="destructive">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className='p-4 w-fit'>
        <Button onClick={() => signOut()}>Sign Out</Button>
      </div>
    </div>
  );
}
