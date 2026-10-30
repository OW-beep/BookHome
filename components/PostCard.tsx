import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/articles/${post.slug}`}
      style={{ display: "block", background: "#FFFBF3", borderRadius: 18, padding: 22, marginBottom: 14, textDecoration: "none", color: "inherit", boxShadow: "0 3px 0 rgba(51,65,92,0.06)" }}
    >
      <div style={{ fontSize: 11, color: "#7FB8E0", marginBottom: 6 }}>{post.category}</div>
      <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 17, marginBottom: 8, lineHeight: 1.5 }}>{post.title}</div>
      <div style={{ fontSize: 13, color: "#7A88A3", lineHeight: 1.7 }}>{post.excerpt}</div>
      <div style={{ fontSize: 11, color: "#B0BBCC", marginTop: 10 }}>{post.updated && post.updated !== post.date ? `更新 ${post.updated}` : post.date}</div>
    </Link>
  );
}
