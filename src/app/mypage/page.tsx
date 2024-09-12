import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/auth/signin"); // ログアウト後はサインインページにリダイレクト
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-4">マイページ</h1>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSignOut}
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
