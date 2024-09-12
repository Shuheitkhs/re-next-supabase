"use client"; // これを追加

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
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
          【作成中】アカウント作成フォームを作成中です！
        </button>
      </div>
    </div>
  );
}
