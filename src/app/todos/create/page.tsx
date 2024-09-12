"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateTodoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("未着手"); // ステータスの初期値
  const [error, setError] = useState<string | null>(null); // エラーメッセージ
  const router = useRouter();

  const validateInput = () => {
    // タイトルのバリデーション (50文字以内)
    if (title.length === 0 || title.length > 50) {
      setError("タイトルは50文字以内で入力してください。");
      return false;
    }

    // 内容のバリデーション (100文字以内)
    if (description.length > 100) {
      setError("内容は100文字以内で入力してください。");
      return false;
    }

    // ステータスのバリデーション (完了,進行中,未着手)
    if (!["完了", "進行中", "未着手"].includes(status)) {
      setError(
        "ステータスは「完了」「進行中」「未着手」のいずれかを選択してください。"
      );
      return false;
    }

    return true;
  };

  const handleCreateTodo = async () => {
    // バリデーションの確認
    if (!validateInput()) return;

    // セッションからユーザーIDを取得
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.error("Error fetching session:", sessionError?.message);
      return;
    }

    const user = sessionData.session.user;

    // 新しいTodoを挿入
    const { error } = await supabase.from("todos").insert([
      {
        title,
        description,
        user_id: user.id, // ログイン中のユーザーIDを設定
        status, // ステータスを追加
      },
    ]);

    if (error) {
      console.error("Error creating todo:", error.message);
    } else {
      // 成功したらTodo一覧ページに遷移
      router.push("/todos");
    }
  };

  const handleCancel = () => {
    router.push("/todos"); // キャンセルした場合も一覧に戻る
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新しいTodoを作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
      {/* エラーメッセージ表示 */}
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
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleCreateTodo}
      >
        作成
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
        onClick={handleCancel}
      >
        キャンセル
      </button>
    </div>
  );
}
