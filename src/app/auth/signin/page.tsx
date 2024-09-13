"use client"; // これを追加

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ログインボタンを押したときのハンドラー
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_REDIRECT_URL,
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };
  // メールでのログイン
  const handleMailSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message); // エラーがあれば表示
    } else {
      router.push("/todos"); // ログイン成功後にリダイレクト
    }
  };

  // 認証状態を確認し、認証済みの場合はマイページにリダイレクト
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/mypage"); // ログイン済みならマイページへ
      }
    };
    checkSession();
  }, [router]); // router を依存配列に追加

  // サインアップボタンを押したときのハンドラー
  const handleSignUpRedirect = () => {
    router.push("/auth/signup"); // サインアップページにリダイレクト
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">Googleでサインインできます</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoogleLogin}
        >
          Googleでサインイン
        </button>
        <h1 className="text-2xl font-bold mt-4 py-2">
          専用のアカウントを作成する
        </h1>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSignUpRedirect} // サインアップページに遷移
        >
          メールアドレスでアカウントを作成
        </button>
        <div className="flex justify-center items-center mt-5">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6">
              アカウントをお持ちの方はログイン
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">メールアドレス</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">パスワード</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
              />
            </div>
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
              onClick={handleMailSignIn}
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
