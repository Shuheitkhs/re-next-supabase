"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js"; // Session 型をインポート

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null); // 型を指定
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setSession(data.session); // sessionがnullでない場合はセット
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ようこそ Todoアプリへ</h1>
      {session ? (
        <div>
          <p className="mb-4">
            こんにちは、{session.user?.user_metadata.full_name} さん！
          </p>{" "}
          {/* userが存在する場合 */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/todos")}
          >
            Todo一覧を見る
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4"
            onClick={() => router.push("/todos/create")}
          >
            新しいTodoを作成
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Todoの管理にはログインが必要です。</p>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/auth/signin")}
          >
            ログイン
          </button>
        </div>
      )}
    </div>
  );
}
