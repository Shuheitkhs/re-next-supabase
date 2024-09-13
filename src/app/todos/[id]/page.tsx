"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching todo:", error.message);
      } else {
        setTodo(data);
      }
    };

    fetchTodo();
  }, [params.id]);

  if (!todo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo詳細</h1>
      <p>
        <strong>タイトル:</strong> {todo.title}
      </p>
      <p>
        <strong>詳細:</strong> {todo.description}
      </p>
      <p>
        <strong>ステータス:</strong> {todo.status}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => router.push(`/todos/${todo.id}/edit`)}
      >
        編集
      </button>
    </div>
  );
}
