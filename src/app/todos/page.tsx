"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("Error fetching session:", sessionError?.message);
        return;
      }

      const user = sessionData.session.user;
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id); // ユーザーIDに基づいてTODOを取得

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(data);
      }
    };

    fetchTodos();
  }, []);

  const handleEditClick = (id: string) => {
    router.push(`/todos/${id}/edit`); // 編集ページに遷移
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">あなたのTODO一覧</h1>
      {todos.length === 0 ? (
        <p>Todoはありません。</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="mb-4">
              <h2 className="text-lg font-bold">{todo.title}</h2>
              <p>{todo.description}</p>
              <span className="text-gray-500">{todo.status}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
                onClick={() => handleEditClick(todo.id)}
              >
                編集
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
