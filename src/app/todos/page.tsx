"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string; // 各Todoに関連するユーザーID
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]); // todosに修正
  const [userId, setUserId] = useState<string | null>(null); // 現在のユーザーID
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(""); // 検索キーワード
  const [statusFilter, setStatusFilter] = useState("すべて"); // ステータスフィルター

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("todos").select("*");

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(data);
      }
    };

    // 現在のユーザーIDを取得
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("Error fetching session:", sessionError?.message);
        return;
      }

      setUserId(sessionData.session.user.id); // ログインしているユーザーのIDをセット
    };

    fetchTodos();
    fetchSession();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/todos/${id}/edit`);
  };

  // `todos`を`filteredTodoList`にフィルタリング
  const filteredTodoList = todos.filter((todo: Todo) => {
    // todoに型定義を追加
    const matchesSearchTerm =
      todo.title.includes(searchTerm) || todo.description.includes(searchTerm);
    const matchesStatus =
      statusFilter === "すべて" || todo.status === statusFilter;
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo一覧</h1>
      {/* 検索バーとフィルター */}
      <div className="mb-4">
        <input
          className="border rounded w-full py-2 px-3"
          placeholder="検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <select
          className="border rounded w-full py-2 px-3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="すべて">すべて</option>
          <option value="未着手">未着手</option>
          <option value="進行中">進行中</option>
          <option value="完了">完了</option>
        </select>
      </div>
      <ul>
        {filteredTodoList.map((todo) => (
          <li key={todo.id} className="mb-4 border-b pb-4">
            <h2 className="text-xl font-bold">{todo.title}</h2>
            <p>{todo.description}</p>
            <p className="text-sm text-gray-500">{todo.status}</p>

            {todo.user_id === userId && ( // 自分のTodoだけに編集ボタンを表示
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleEdit(todo.id)}
              >
                編集
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
