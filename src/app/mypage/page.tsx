"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"; // SupabaseのUser型をインポート

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null); // User型とnullを許可
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData?.session) {
        router.push("/auth/signin"); // 認証されていない場合はサインインページへリダイレクト
        return;
      }

      setUser(sessionData.session.user); // ユーザー情報をセット
    };

    fetchUser();
  }, [router]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/auth/signin"); // ログアウト後はサインインページにリダイレクト
    }
  };

  if (!user) {
    return <p>Loading...</p>; // ローディング表示
  }

  // Display Nameを表示する
  const displayName = user.user_metadata?.full_name || user.email; // displayNameがない場合はメールを表示

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">マイページ</h1>
      <p>こんにちは、{displayName} さん</p> {/* Display Nameを表示 */}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSignOut}
      >
        ログアウト
      </button>
      <a href="/todos" className="text-blue-500 hover:underline mt-4 block">
        TODOリストを見る
      </a>
    </div>
  );
}
