"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string; // 各Todoの作成者のユーザーID
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // 現在のユーザーIDを保存
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null); // 現在のユーザーのDisplayName
  const router = useRouter();

  useEffect(() => {
    const fetchSessionAndTodos = async () => {
      // セッションからユーザーIDとDisplayNameを取得
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session) {
        console.error("Error fetching session:", sessionError?.message);
        return;
      }

      const user = sessionData.session.user;
      setUserId(user.id); // 現在のユーザーIDを保存
      setUserDisplayName(user.user_metadata.full_name || user.email); // DisplayNameかメールアドレスを保存

      // すべてのTodoを取得
      const { data, error } = await supabase.from("todos").select("*");

      if (error) {
        console.error("Error fetching todos:", error.message);
      } else {
        setTodos(data);
      }
    };

    fetchSessionAndTodos();
  }, []);

  const handleEditClick = (id: string) => {
    router.push(`/todos/${id}/edit`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">全てのTODO一覧</h1>
      {todos.length === 0 ? (
        <p>Todoはありません。</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="mb-4">
              <h2 className="text-lg font-bold">{todo.title}</h2>
              <p>{todo.description}</p>
              <span className="text-gray-500">{todo.status}</span>

              {/* DisplayNameを表示 */}
              <p className="text-sm text-gray-400">
                作成者: {userDisplayName ? userDisplayName : "不明なユーザー"}
              </p>

              {/* ログインしているユーザーのTodoにだけ編集ボタンを表示 */}
              {userId === todo.user_id && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
                  onClick={() => handleEditClick(todo.id)}
                >
                  編集
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
