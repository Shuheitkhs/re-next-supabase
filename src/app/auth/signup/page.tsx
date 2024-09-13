"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // エラーメッセージの状態管理
  const router = useRouter();

  const validateSignup = () => {
    // メールアドレスのバリデーション (正規表現で形式チェック)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("有効なメールアドレスを入力してください。");
      return false;
    }

    // パスワードのバリデーション (8文字以上)
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください。");
      return false;
    }

    return true; // バリデーションが成功した場合はtrueを返す
  };

  const handleSignUp = async () => {
    if (!validateSignup()) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message); // エラー処理
    } else {
      router.push("/auth/signin"); // サインアップが成功したらサインインページにリダイレクト
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">サインアップ</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
        {/* エラーメッセージ表示 */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: yourname@example.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">パスワード</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8文字以上のパスワード"
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          onClick={handleSignUp}
        >
          サインアップ
        </button>
        <p className="mt-4 text-center">
          すでにアカウントをお持ちですか？{" "}
          <a href="/auth/signin" className="text-blue-500 hover:underline">
            サインイン
          </a>
        </p>
      </div>
    </div>
  );
}
