"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type NewBookInput = {
  title: string;
  author: string;
  genre: string;
  cover_color: string;
  cover_emoji: string;
  publisher?: string;
  list_price?: number | null;
  purchase_price?: number | null;
  isbn?: string | null;
  cover_image_url?: string | null;
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
    publisher: input.publisher || null,
    list_price: input.list_price ?? null,
    purchase_price: input.purchase_price ?? null,
    isbn: input.isbn || null,
    cover_image_url: input.cover_image_url || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function logRead(
  bookId: string,
  currentReadCount: number,
  input: {
    minutes: number | null;
    read_at: string;
    reading_type: "self_read" | "read_aloud";
    readers: string[];
    completed: boolean;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error: logError } = await supabase.from("reading_logs").insert({
    book_id: bookId,
    user_id: user.id,
    minutes: input.minutes,
    read_at: input.read_at,
    reading_type: input.reading_type,
    readers: input.readers.length > 0 ? input.readers : null,
    completed: input.completed,
  });
  if (logError) throw new Error(logError.message);

  const { error: updateError } = await supabase
    .from("books")
    .update({ read_count: currentReadCount + 1 })
    .eq("id", bookId);
  if (updateError) throw new Error(updateError.message);

  revalidatePath("/library");
}

export async function updateBookDetails(
  id: string,
  input: NewBookInput
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("books")
    .update({
      title: input.title,
      author: input.author || null,
      genre: input.genre,
      cover_color: input.cover_color,
      cover_emoji: input.cover_emoji,
      publisher: input.publisher || null,
      list_price: input.list_price ?? null,
      purchase_price: input.purchase_price ?? null,
    })
    .eq("id", id);
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

export async function addFamilyMember(name: string, emoji: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("family_members")
    .insert({ user_id: user.id, name, emoji });
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function deleteFamilyMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("family_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function updateAnnualGoal(goal: number | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: user.id, annual_goal: goal, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  revalidatePath("/library");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
