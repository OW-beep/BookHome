"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type NewBookInput = {
  title: string;
  author: string;
  genre: string;
  cover_color: string;
  cover_emoji: string;
};

export async function addBook(input: NewBookInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("books").insert({
    user_id: user.id,
    title: input.title,
    author: input.author || null,
    genre: input.genre,
    cover_color: input.cover_color,
    cover_emoji: input.cover_emoji,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function updateBook(
  id: string,
  patch: Partial<{
    rating: number;
    favorite: boolean;
    read_count: number;
  }>
) {
  const supabase = await createClient();
  const { error } = await supabase.from("books").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function deleteBook(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function addComment(bookId: string, text: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("book_comments").insert({
    book_id: bookId,
    user_id: user.id,
    text,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
