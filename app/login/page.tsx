"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { trackEvent } from "@/lib/analytics";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState("");

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

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setCodeError("");

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setCodeError("コードが正しくないか、期限切れです。もう一度お試しください。");
      setVerifying(false);
      return;
    }

    trackEvent("login_success", { method: "otp_code" });
    window.location.href = "/library";
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
          <div style={{ marginTop: 24 }}>
            <p style={{ fontSize: 14, color: "#33415C" }}>
              📩 {email} に確認コードを送りました。
            </p>
            <p style={{ color: "#7A88A3", fontSize: 12, marginBottom: 16 }}>
              メールに書かれている6桁のコードを、下に入力してください。
            </p>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  border: "2px solid #E3ECF3",
                  borderRadius: 12,
                  padding: "14px",
                  fontSize: 22,
                  letterSpacing: 6,
                  textAlign: "center",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                disabled={verifying}
                className="font-display"
                style={{
                  width: "100%",
                  marginTop: 12,
                  background: "#FF8FA0",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  opacity: verifying ? 0.6 : 1,
                }}
              >
                {verifying ? "確認中..." : "コードでログイン"}
              </button>
              {codeError && (
                <p style={{ color: "#E06B7D", fontSize: 12, marginTop: 8 }}>
                  {codeError}
                </p>
              )}
            </form>

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
              {status === "sending" ? "送信中..." : "ログインコードを送る"}
            </button>
            {status === "error" && (
              <p style={{ color: "#E06B7D", fontSize: 12, marginTop: 8 }}>
                {errorMsg}
              </p>
            )}
          </form>
        )}

        <p style={{ fontSize: 10, color: "#B0BBCC", marginTop: 20 }}>
          <a href="/privacy" style={{ color: "#B0BBCC" }}>プライバシーポリシー</a>
          {" ・ "}
          <a href="/terms" style={{ color: "#B0BBCC" }}>利用規約</a>
        </p>
      </div>
    </div>
  );
}

