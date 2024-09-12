"use client";

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
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
