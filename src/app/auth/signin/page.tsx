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

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">Sign in with Google</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
