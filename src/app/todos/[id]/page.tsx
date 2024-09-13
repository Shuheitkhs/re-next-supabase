"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  description: string;
  status: string;
  user_id: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTodoAndComments = async () => {
      const { data: todoData, error: todoError } = await supabase
        .from("todos")
        .select("*")
        .eq("id", params.id)
        .single();

      if (todoError) {
        console.error("Error fetching todo:", todoError.message);
      } else {
        setTodo(todoData);
      }

      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("todo_id", params.id);

      if (commentsError) {
        console.error("Error fetching comments:", commentsError.message);
      } else {
        setComments(commentsData);
      }
    };

    fetchTodoAndComments();
  }, [params.id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.error("Error fetching session:", sessionError?.message);
      return;
    }

    const user = sessionData.session.user;

    const { error } = await supabase.from("comments").insert([
      {
        content: newComment,
        todo_id: params.id,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding comment:", error.message);
    } else {
      setNewComment("");
      // コメントを再取得
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("todo_id", params.id);
      setComments(commentsData || []);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.error("Error fetching session:", sessionError?.message);
      return;
    }

    const user = sessionData.session.user;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (error) {
      console.error("Error deleting comment:", error.message);
    } else {
      setNewComment("");
      // コメントを再取得
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("todo_id", params.id);
      setComments(commentsData || []);
    }
  };

  const handleCancel = () => {
    router.push("/todos"); // キャンセルした場合も一覧に戻る
  };
  if (!todo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo詳細</h1>
      <p>
        <strong>タイトル:</strong> {todo.title}
      </p>
      <p>
        <strong>詳細:</strong> {todo.description}
      </p>
      <p>
        <strong>ステータス:</strong> {todo.status}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => router.push(`/todos/${todo.id}/edit`)}
      >
        編集
      </button>

      <button
        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded ml-3"
        onClick={handleCancel}
      >
        キャンセル
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">コメント</h2>
        {comments.length === 0 ? (
          <p>コメントはまだありません。</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.id} className="mb-2">
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500">
                  投稿日: {comment.created_at}
                </p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  コメントを削除
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <textarea
            className="border rounded w-full p-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="コメントを入力"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={handleAddComment}
          >
            コメントを追加
          </button>
        </div>
      </div>
    </div>
  );
}
