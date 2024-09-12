"use client";
import "./globals.css"; // Tailwind CSSのインポート

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@supabase/auth-js"; // Session 型をインポート

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 初期値を null に設定し、Session 型も許容
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 認証状態の監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // 認証状態の取得
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/auth/signin"); // 認証されていない場合はサインインページへリダイレクト
      }
    };
    fetchSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <html lang="ja">
      <body>
        <div className="flex h-screen">
          {/* サイドバーとしてナビゲーションバーを左に配置 */}
          <nav className="bg-gray-800 text-white w-64 p-4 flex-shrink-0">
            <p className="font-bold m-4 text-xl">re-next-supabase</p>
            <ul className="space-y-4">
              <li>
                <a href="/todos" className="hover:text-gray-400 block">
                  Todo一覧
                </a>
              </li>
              <li>
                <a href="/todos/create" className="hover:text-gray-400 block">
                  新しいTodoを作成
                </a>
              </li>
              <li>
                <a href="/mypage" className="hover:text-gray-400 block">
                  マイページ
                </a>
              </li>
            </ul>
          </nav>

          {/* ページのコンテンツを右側に表示 */}
          <main className="flex-grow p-8 bg-gray-100">{children}</main>
        </div>
      </body>
    </html>
  );
}
