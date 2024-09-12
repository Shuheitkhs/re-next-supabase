"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
}

export default function EditTodoPage({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("未着手"); // ステータスの初期値
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
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status); // ステータスもセット
      }
    };

    fetchTodo();
  }, [params.id]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ title, description, status }) // ステータスも更新
      .eq("id", params.id);

    if (error) {
      console.error("Error updating todo:", error.message);
    } else {
      router.push("/todos"); // 更新後に一覧に戻る
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("todos").delete().eq("id", params.id);

    if (error) {
      console.error("Error deleting todo:", error.message);
    } else {
      router.push("/todos"); // 削除後に一覧に戻る
    }
  };

  const handleCancel = () => {
    router.push("/todos"); // キャンセルした場合も一覧に戻る
  };

  if (!todo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODO編集</h1>
      <div className="mb-4">
        <label className="block text-gray-700">タイトル</label>
        <input
          className="border rounded w-full py-2 px-3"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">詳細</label>
        <textarea
          className="border rounded w-full py-2 px-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">ステータス</label>
        <select
          className="border rounded w-full py-2 px-3"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={handleUpdate}
        >
          更新
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          削除
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          onClick={handleCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
