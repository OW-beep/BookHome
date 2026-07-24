"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 320px, #F3F8FC 100%)",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#FFFBF3",
          borderRadius: 24,
          padding: 32,
          maxWidth: 380,
          width: "100%",
          boxShadow: "0 10px 30px rgba(51,65,92,0.12)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>📚🏠</div>
        <h1
          className="font-display"
          style={{ fontSize: 24, fontWeight: 900, color: "#33415C", margin: 0 }}
        >
          ブックホーム
        </h1>
        <p style={{ fontSize: 13, color: "#7A88A3", marginTop: 6 }}>
          家族みんなでも、こども専用でも。
        </p>

        {status === "sent" ? (
          <div style={{ marginTop: 24, fontSize: 14, color: "#33415C" }}>
            <p>📩 {email} にログインリンクを送りました。</p>
            <p style={{ color: "#7A88A3", fontSize: 12 }}>
              メール内のリンクをタップしてログインしてください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
            <input
              type="email"
              required
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "2px solid #E3ECF3",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="font-display"
              style={{
                width: "100%",
                marginTop: 12,
                background: "#33415C",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                opacity: status === "sending" ? 0.6 : 1,
              }}
            >
              {status === "sending" ? "送信中..." : "ログインリンクを送る"}
            </button>
            {status === "error" && (
              <p style={{ color: "#E06B7D", fontSize: 12, marginTop: 8 }}>
                {errorMsg}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
