"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Star,
  Heart,
  Plus,
  X,
  ScanLine,
  Search,
  Sparkles,
  Trash2,
  PencilLine,
  LogOut,
} from "lucide-react";
import { Book, GENRES, COVER_COLORS, EMOJIS } from "@/lib/types";
import {
  addBook,
  updateBook,
  deleteBook,
  addComment,
  signOut,
  NewBookInput,
} from "@/app/library/actions";

const MOCK_ISBN_BOOKS = [
  { title: "ぐるぐるの森のひみつ", author: "きしもと ゆう", genre: "えほん", emoji: "🌳" },
  { title: "きょうりゅう大図鑑 スーパーばん", author: "監修 いのうえ たかし", genre: "ずかん", emoji: "🦕" },
  { title: "そらとぶパン工場", author: "たなか みずき", genre: "えほん", emoji: "🥐" },
  { title: "ほしのカケラをさがして", author: "みうら はな", genre: "しょうせつ", emoji: "🌙" },
  { title: "うちゅうたんけんずかん", author: "監修 さとう けん", genre: "ずかん", emoji: "🚀" },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function BookShelfClient({
  initialBooks,
  userEmail,
}: {
  initialBooks: Book[];
  userEmail: string;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isPending, startTransition] = useTransition();

  const [showAddModal, setShowAddModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedBadge, setScannedBadge] = useState(false);
  const [form, setForm] = useState<NewBookInput>({
    title: "",
    author: "",
    genre: GENRES[0],
    cover_color: COVER_COLORS[0],
    cover_emoji: EMOJIS[0],
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState("すべて");
  const [query, setQuery] = useState("");
  const [newComment, setNewComment] = useState("");

  const selectedBook = books.find((b) => b.id === selectedId) || null;

  const totalBooks = books.length;
  const totalReads = books.reduce((s, b) => s + b.read_count, 0);
  const totalFavorites = books.filter((b) => b.favorite).length;
  const level = Math.max(1, Math.floor(totalReads / 5) + 1);
  const levelProgress = ((totalReads % 5) / 5) * 100;

  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchGenre = genreFilter === "すべて" || b.genre === genreFilter;
      const matchQuery = (b.title + (b.author ?? ""))
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchGenre && matchQuery;
    });
  }, [books, genreFilter, query]);

  const rows = chunk(filtered, 6);

  function resetForm() {
    setForm({
      title: "",
      author: "",
      genre: GENRES[0],
      cover_color: COVER_COLORS[0],
      cover_emoji: EMOJIS[0],
    });
    setScannedBadge(false);
  }

  function openAddModal() {
    resetForm();
    setShowAddModal(true);
  }

  function handleScan() {
    setScanning(true);
    setTimeout(() => {
      const pick =
        MOCK_ISBN_BOOKS[Math.floor(Math.random() * MOCK_ISBN_BOOKS.length)];
      setForm({
        title: pick.title,
        author: pick.author,
        genre: pick.genre,
        cover_color:
          COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)],
        cover_emoji: pick.emoji,
      });
      setScanning(false);
      setScannedBadge(true);
    }, 900);
  }

  function submitBook(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setShowAddModal(false);
    startTransition(async () => {
      await addBook(form);
    });
  }

  function optimisticPatch(id: string, patch: Partial<Book>) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  }

  function handleAddRead(book: Book) {
    const next = book.read_count + 1;
    optimisticPatch(book.id, { read_count: next });
    startTransition(async () => {
      await updateBook(book.id, { read_count: next });
    });
  }

  function handleSetRating(book: Book, rating: number) {
    optimisticPatch(book.id, { rating });
    startTransition(async () => {
      await updateBook(book.id, { rating });
    });
  }

  function handleToggleFavorite(book: Book) {
    const favorite = !book.favorite;
    optimisticPatch(book.id, { favorite });
    startTransition(async () => {
      await updateBook(book.id, { favorite });
    });
  }

  function handleAddComment(bookId: string) {
    if (!newComment.trim()) return;
    const text = newComment.trim();
    setNewComment("");
    startTransition(async () => {
      await addComment(bookId, text);
    });
  }

  function handleDelete(id: string) {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId(null);
    startTransition(async () => {
      await deleteBook(id);
    });
  }

  return (
    <div className="bh-app">
      <style>{`
        .bh-app { font-family: 'M PLUS Rounded 1c', sans-serif; background: linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 320px, #F3F8FC 100%); min-height: 100vh; color: #33415C; padding-bottom: 80px; }
        .bh-header { padding: 24px 20px 18px; text-align: center; position: relative; }
        .bh-signout { position: absolute; top: 24px; right: 20px; display: flex; align-items: center; gap: 4px; background: #fff; border: none; border-radius: 999px; padding: 6px 12px; font-size: 11px; color: #7A88A3; cursor: pointer; box-shadow: 0 2px 0 rgba(51,65,92,0.06); }
        .bh-logo-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .bh-logo-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 28px; color: #33415C; }
        .bh-tagline { margin-top: 6px; font-size: 12px; color: #7A88A3; font-weight: 500; }
        .bh-stats { display: flex; gap: 10px; max-width: 640px; margin: 16px auto 0; padding: 0 16px; flex-wrap: wrap; justify-content: center; }
        .bh-stat-chip { background: #FFFBF3; border-radius: 18px; padding: 10px 16px; box-shadow: 0 3px 0 rgba(51,65,92,0.08); display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; min-width: 92px; justify-content: center; }
        .bh-stat-num { font-family: 'Zen Maru Gothic', sans-serif; font-size: 18px; }
        .bh-level-bar-wrap { max-width: 420px; margin: 14px auto 0; padding: 0 20px; }
        .bh-level-label { font-size: 12px; font-weight: 700; color: #7A88A3; margin-bottom: 4px; display: flex; justify-content: space-between; }
        .bh-level-track { height: 10px; background: #E3ECF3; border-radius: 999px; overflow: hidden; }
        .bh-level-fill { height: 100%; background: linear-gradient(90deg, #FFC94A, #FF8FA0); border-radius: 999px; transition: width 0.5s ease; }
        .bh-controls { max-width: 900px; margin: 24px auto 8px; padding: 0 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .bh-search { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 14px; padding: 8px 14px; box-shadow: 0 2px 0 rgba(51,65,92,0.06); flex: 1; min-width: 160px; }
        .bh-search input { border: none; outline: none; font-family: inherit; font-size: 14px; width: 100%; background: transparent; color: #33415C; }
        .bh-genre-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .bh-chip { border: none; background: #fff; padding: 7px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #7A88A3; cursor: pointer; box-shadow: 0 2px 0 rgba(51,65,92,0.06); }
        .bh-chip.active { background: #33415C; color: #fff; }
        .bh-shelf-area { max-width: 900px; margin: 20px auto 0; padding: 0 20px; }
        .bh-shelf-row { position: relative; margin-bottom: 44px; }
        .bh-spines { display: flex; align-items: flex-end; gap: 3px; min-height: 150px; padding: 10px 6px 0; flex-wrap: wrap; }
        .bh-plank { height: 16px; background: linear-gradient(180deg, #C98A54 0%, #A66A3D 100%); border-radius: 4px; box-shadow: 0 6px 0 rgba(0,0,0,0.08), 0 8px 10px rgba(166,106,61,0.25); margin-top: -4px; }
        .bh-spine { border: none; cursor: pointer; border-radius: 6px 6px 3px 3px; height: 148px; width: 46px; display: flex; align-items: flex-start; justify-content: center; padding: 10px 4px; box-shadow: inset -3px 0 0 rgba(0,0,0,0.08), 0 3px 4px rgba(0,0,0,0.12); position: relative; transition: transform 0.15s ease; }
        .bh-spine:hover { transform: translateY(-6px); }
        .bh-spine-text { writing-mode: vertical-rl; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 12px; color: rgba(0,0,0,0.65); max-height: 128px; overflow: hidden; white-space: nowrap; }
        .bh-spine-fav { position: absolute; top: 4px; right: 2px; font-size: 11px; }
        .bh-empty { text-align: center; padding: 60px 20px; color: #7A88A3; }
        .bh-empty-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 16px; color: #33415C; margin-top: 10px; }
        .bh-fab { position: fixed; bottom: 22px; right: 22px; background: #FF8FA0; color: #fff; border: none; border-radius: 999px; padding: 14px 22px; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 6px; box-shadow: 0 6px 0 #E06B7D, 0 8px 16px rgba(255,143,160,0.4); cursor: pointer; }
        .bh-fab:active { transform: translateY(4px); box-shadow: 0 2px 0 #E06B7D; }
        .bh-modal-backdrop { position: fixed; inset: 0; background: rgba(51,65,92,0.35); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 50; }
        .bh-modal { background: #FFFBF3; border-radius: 24px; max-width: 440px; width: 100%; max-height: 88vh; overflow-y: auto; padding: 22px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .bh-modal-close { position: absolute; top: 16px; right: 16px; background: #EAF4FB; border: none; border-radius: 999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #33415C; }
        .bh-modal-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 19px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
        .bh-scan-box { border: 2px dashed #B9CBDD; border-radius: 16px; padding: 28px 16px; text-align: center; margin-bottom: 14px; }
        .bh-scan-btn { margin-top: 12px; background: #7FB8E0; color: #fff; border: none; border-radius: 12px; padding: 10px 20px; font-weight: 700; font-family: inherit; font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 0 #5C93BD; }
        .bh-scan-pulse { width: 46px; height: 46px; border-radius: 50%; background: #7FB8E0; margin: 0 auto; animation: bh-pulse 0.9s ease-in-out infinite; }
        @keyframes bh-pulse { 0%, 100% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.2); opacity: 1; } }
        .bh-field { margin-bottom: 12px; }
        .bh-field label { display: block; font-size: 12px; font-weight: 700; color: #7A88A3; margin-bottom: 5px; }
        .bh-field input, .bh-field select { width: 100%; border: 2px solid #E3ECF3; border-radius: 10px; padding: 9px 12px; font-family: inherit; font-size: 14px; color: #33415C; outline: none; box-sizing: border-box; }
        .bh-swatches { display: flex; gap: 8px; flex-wrap: wrap; }
        .bh-swatch { width: 28px; height: 28px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; }
        .bh-swatch.selected { border-color: #33415C; }
        .bh-emoji-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .bh-emoji-btn { font-size: 18px; background: #EAF4FB; border: 2px solid transparent; border-radius: 8px; padding: 4px 7px; cursor: pointer; }
        .bh-emoji-btn.selected { border-color: #33415C; }
        .bh-scanned-badge { display: inline-flex; align-items: center; gap: 4px; background: #E8F7EC; color: #3F9457; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-bottom: 10px; }
        .bh-submit-btn { width: 100%; background: #33415C; color: #fff; border: none; border-radius: 12px; padding: 12px; font-family: 'Zen Maru Gothic', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 6px; }
        .bh-detail-cover { width: 88px; height: 88px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 38px; margin: 0 auto 12px; box-shadow: 0 6px 14px rgba(0,0,0,0.15); }
        .bh-detail-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 18px; text-align: center; }
        .bh-detail-author { text-align: center; font-size: 13px; color: #7A88A3; margin-top: 4px; }
        .bh-genre-tag { display: block; text-align: center; margin: 8px auto 14px; font-size: 11px; font-weight: 700; color: #33415C; background: #EAF4FB; border-radius: 999px; padding: 3px 12px; width: fit-content; }
        .bh-row-actions { display: flex; justify-content: center; gap: 14px; margin-bottom: 16px; }
        .bh-icon-btn { background: #fff; border: none; border-radius: 999px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 0 rgba(51,65,92,0.08); color: #B9CBDD; }
        .bh-icon-btn.on { color: #FF8FA0; }
        .bh-stars { display: flex; justify-content: center; gap: 4px; margin-bottom: 16px; }
        .bh-read-section { background: #EAF4FB; border-radius: 14px; padding: 12px 14px; text-align: center; margin-bottom: 16px; }
        .bh-read-count { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 22px; color: #33415C; }
        .bh-read-btn { margin-top: 8px; background: #7EC98C; color: #fff; border: none; border-radius: 10px; padding: 8px 16px; font-weight: 700; font-family: inherit; font-size: 13px; cursor: pointer; box-shadow: 0 3px 0 #58A466; }
        .bh-comments-title { font-size: 12px; font-weight: 700; color: #7A88A3; margin-bottom: 8px; }
        .bh-comment { background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 13px; margin-bottom: 6px; }
        .bh-comment-date { font-size: 10px; color: #B0BBCC; margin-top: 2px; }
        .bh-comment-add { display: flex; gap: 6px; margin-top: 8px; }
        .bh-comment-add input { flex: 1; border: 2px solid #E3ECF3; border-radius: 10px; padding: 8px 12px; font-family: inherit; font-size: 13px; outline: none; }
        .bh-comment-add button { background: #33415C; color: #fff; border: none; border-radius: 10px; padding: 0 14px; cursor: pointer; font-weight: 700; }
        .bh-delete-row { text-align: center; margin-top: 16px; }
        .bh-delete-link { background: none; border: none; color: #D98A8A; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; font-family: inherit; }
      `}</style>

      <div className="bh-header">
        <button
          className="bh-signout"
          onClick={() => startTransition(async () => await signOut())}
        >
          <LogOut size={12} /> {userEmail} をログアウト
        </button>
        <div className="bh-logo-row">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none">
            <path d="M32 10L54 20V52C54 52 44 46 32 46C20 46 10 52 10 52V20L32 10Z" fill="#FFC94A" stroke="#33415C" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M32 10V46" stroke="#33415C" strokeWidth="3"/>
          </svg>
          <span className="bh-logo-title">ブックホーム</span>
        </div>
        <div className="bh-tagline">家族みんなでも、こども専用でも。</div>

        <div className="bh-level-bar-wrap">
          <div className="bh-level-label">
            <span>としょかん Lv.{level}</span>
            <span>{totalReads} さつ よんだ</span>
          </div>
          <div className="bh-level-track">
            <div className="bh-level-fill" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="bh-stats">
          <div className="bh-stat-chip"><span className="bh-stat-num">{totalBooks}</span>さつ蔵書</div>
          <div className="bh-stat-chip"><span className="bh-stat-num">{totalReads}</span>回よんだ</div>
          <div className="bh-stat-chip"><span className="bh-stat-num">{totalFavorites}</span>おきにいり</div>
        </div>
      </div>

      <div className="bh-controls">
        <div className="bh-search">
          <Search size={16} color="#B0BBCC" />
          <input placeholder="タイトル・作者でさがす" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="bh-genre-chips">
          {["すべて", ...GENRES].map((g) => (
            <button key={g} className={`bh-chip ${genreFilter === g ? "active" : ""}`} onClick={() => setGenreFilter(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="bh-shelf-area">
        {filtered.length === 0 ? (
          <div className="bh-empty">
            <div style={{ fontSize: 44 }}>🦉📚</div>
            <div className="bh-empty-title">まだ本がありません</div>
            <div>さいしょの1さつを追加してみよう！</div>
          </div>
        ) : (
          rows.map((row, ri) => (
            <div className="bh-shelf-row" key={ri}>
              <div className="bh-spines">
                {row.map((b) => (
                  <button
                    key={b.id}
                    className="bh-spine"
                    style={{ background: b.cover_color }}
                    onClick={() => setSelectedId(b.id)}
                    title={b.title}
                  >
                    {b.favorite && <span className="bh-spine-fav">❤️</span>}
                    <span className="bh-spine-text">{b.title}</span>
                  </button>
                ))}
              </div>
              <div className="bh-plank" />
            </div>
          ))
        )}
      </div>

      <button className="bh-fab" onClick={openAddModal}>
        <Plus size={18} /> ほんをふやす
      </button>

      {showAddModal && (
        <div className="bh-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bh-modal-close" onClick={() => setShowAddModal(false)}><X size={16} /></button>
            <div className="bh-modal-title"><Sparkles size={18} color="#FFC94A" /> 本を登録する</div>

            <div className="bh-scan-box">
              {scanning ? (
                <>
                  <div className="bh-scan-pulse" />
                  <div style={{ marginTop: 10, fontSize: 13, color: "#7A88A3" }}>スキャン中...</div>
                </>
              ) : (
                <>
                  <ScanLine size={30} color="#7FB8E0" style={{ margin: "0 auto", display: "block" }} />
                  <div style={{ marginTop: 8, fontSize: 12, color: "#7A88A3" }}>バーコードをカメラで読み取ります（デモ）</div>
                  <button className="bh-scan-btn" type="button" onClick={handleScan}>
                    <ScanLine size={14} /> スキャンする（デモ）
                  </button>
                </>
              )}
            </div>

            {scannedBadge && <span className="bh-scanned-badge">📷 スキャンで自動入力されました</span>}

            <form onSubmit={submitBook}>
              <div className="bh-field">
                <label>タイトル</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="例：ぐりとぐら" />
              </div>
              <div className="bh-field">
                <label>作者</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="例：なかがわ りえこ" />
              </div>
              <div className="bh-field">
                <label>ジャンル</label>
                <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="bh-field">
                <label>表紙の色</label>
                <div className="bh-swatches">
                  {COVER_COLORS.map((c) => (
                    <div key={c} className={`bh-swatch ${form.cover_color === c ? "selected" : ""}`} style={{ background: c }} onClick={() => setForm({ ...form, cover_color: c })} />
                  ))}
                </div>
              </div>
              <div className="bh-field">
                <label>アイコン</label>
                <div className="bh-emoji-row">
                  {EMOJIS.map((em) => (
                    <button type="button" key={em} className={`bh-emoji-btn ${form.cover_emoji === em ? "selected" : ""}`} onClick={() => setForm({ ...form, cover_emoji: em })}>{em}</button>
                  ))}
                </div>
              </div>
              <button className="bh-submit-btn" type="submit" disabled={isPending}>
                {isPending ? "登録中..." : "この内容で登録する"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedBook && (
        <div className="bh-modal-backdrop" onClick={() => setSelectedId(null)}>
          <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bh-modal-close" onClick={() => setSelectedId(null)}><X size={16} /></button>

            <div className="bh-detail-cover" style={{ background: selectedBook.cover_color }}>{selectedBook.cover_emoji}</div>
            <div className="bh-detail-title">{selectedBook.title}</div>
            <div className="bh-detail-author">{selectedBook.author}</div>
            <div className="bh-genre-tag">{selectedBook.genre}</div>

            <div className="bh-row-actions">
              <button className={`bh-icon-btn ${selectedBook.favorite ? "on" : ""}`} onClick={() => handleToggleFavorite(selectedBook)}>
                <Heart size={18} fill={selectedBook.favorite ? "#FF8FA0" : "none"} />
              </button>
            </div>

            <div className="bh-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => handleSetRating(selectedBook, n)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Star size={22} fill={n <= selectedBook.rating ? "#FFC94A" : "none"} color={n <= selectedBook.rating ? "#FFC94A" : "#D8DFE8"} />
                </button>
              ))}
            </div>

            <div className="bh-read-section">
              <div style={{ fontSize: 12, color: "#7A88A3", fontWeight: 700 }}>よんだ回数</div>
              <div className="bh-read-count">{selectedBook.read_count} 回</div>
              <button className="bh-read-btn" onClick={() => handleAddRead(selectedBook)}>きょう読んだ！ +1</button>
            </div>

            <div className="bh-comments-title">おもいで・コメント</div>
            {selectedBook.book_comments.length === 0 && (
              <div style={{ fontSize: 12, color: "#B0BBCC", marginBottom: 8 }}>まだコメントがありません</div>
            )}
            {selectedBook.book_comments.map((c) => (
              <div className="bh-comment" key={c.id}>
                {c.text}
                <div className="bh-comment-date">{c.created_at.slice(0, 10)}</div>
              </div>
            ))}
            <div className="bh-comment-add">
              <input placeholder="かんそうを書く..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddComment(selectedBook.id)} />
              <button onClick={() => handleAddComment(selectedBook.id)}><PencilLine size={14} /></button>
            </div>

            <div className="bh-delete-row">
              <button className="bh-delete-link" onClick={() => handleDelete(selectedBook.id)}>
                <Trash2 size={12} /> この本を削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
