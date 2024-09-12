"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
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
        .single(); // 特定のTodoを取得

      if (error) {
        console.error("Error fetching todo:", error.message);
      } else {
        setTodo(data); // 取得したTodoデータを状態にセット
      }
    };

    fetchTodo();
  }, [params.id]);

  if (!todo) {
    return <p>Loading...</p>; // ローディング中の表示
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{todo.title}</h1>{" "}
      {/* タイトルを表示 */}
      <p className="mb-4">{todo.description}</p> {/* 詳細を表示 */}
      <p className="text-gray-500">ステータス: {todo.status}</p>{" "}
      {/* ステータスを表示 */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => router.push(`/todos/${todo.id}/edit`)} // 編集ページへのリンク
      >
        編集
      </button>
    </div>
  );
}
