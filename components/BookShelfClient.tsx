"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { IScannerControls } from "@zxing/browser";
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
import { Book, ReadingLog, UserSettings, FamilyMember, GENRES, COVER_COLORS, EMOJIS } from "@/lib/types";
import {
  addBook,
  updateBook,
  updateBookDetails,
  deleteBook,
  addComment,
  signOut,
  logRead,
  updateAnnualGoal,
  addFamilyMember,
  deleteFamilyMember,
  NewBookInput,
} from "@/app/library/actions";
import StatsModal from "@/components/StatsModal";
import RecommendedBooks from "@/components/RecommendedBooks";
import ShareModal from "@/components/ShareModal";
import FamilyModal from "@/components/FamilyModal";
import RelatedBooks from "@/components/RelatedBooks";
import { buildRakutenBookLink } from "@/lib/affiliate";
import { getLevelInfo } from "@/lib/gamification";
import { generateShareImage, generateBookShareImage } from "@/lib/shareImage";
import { BarChart3, Share2, Users } from "lucide-react";

type ScanStatus =
  | "idle"
  | "camera"
  | "looking_up"
  | "found"
  | "not_found"
  | "camera_error";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function BookShelfClient({
  initialBooks,
  initialReadingLogs,
  initialSettings,
  initialFamilyMembers,
  userEmail,
}: {
  initialBooks: Book[];
  initialReadingLogs: ReadingLog[];
  initialSettings: UserSettings;
  initialFamilyMembers: FamilyMember[];
  userEmail: string;
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [readingLogs, setReadingLogs] =
    useState<ReadingLog[]>(initialReadingLogs);
  const [settings, setSettings] = useState<UserSettings>(initialSettings);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isPending, startTransition] = useTransition();
  const [errorToast, setErrorToast] = useState<string | null>(null);

  function runAction(fn: () => Promise<void>, onError?: () => void) {
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        onError?.();
        setErrorToast(
          e instanceof Error
            ? `保存に失敗しました：${e.message}`
            : "保存に失敗しました。もう一度お試しください。"
        );
        setTimeout(() => setErrorToast(null), 5000);
      }
    });
  }

  const [showStats, setShowStats] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareBookId, setShareBookId] = useState<string | null>(null);
  const [showFamily, setShowFamily] = useState(false);
  const [readMinutes, setReadMinutes] = useState("");
  const [readDate, setReadDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [readingType, setReadingType] = useState<"self_read" | "read_aloud">("self_read");
  const [readersList, setReadersList] = useState<string[]>([]);
  const [readerInput, setReaderInput] = useState("");
  const [readCompleted, setReadCompleted] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<"barcode" | "title">("barcode");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scannedBadge, setScannedBadge] = useState(false);
  const [scannedIsbn, setScannedIsbn] = useState<string | null>(null);
  const [scannedCoverUrl, setScannedCoverUrl] = useState<string | null>(null);
  const [titleQuery, setTitleQuery] = useState("");
  const [titleResults, setTitleResults] = useState<
    { isbn: string | null; title: string; author: string | null; publisher: string | null; cover_image_url: string | null }[]
  >([]);
  const [titleSearching, setTitleSearching] = useState(false);
  const [titleSearched, setTitleSearched] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const scanLockRef = useRef(false);
  const [form, setForm] = useState<NewBookInput>({
    title: "",
    author: "",
    genre: GENRES[0],
    cover_color: COVER_COLORS[0],
    cover_emoji: EMOJIS[0],
  });
  const [publisherInput, setPublisherInput] = useState("");
  const [listPriceInput, setListPriceInput] = useState("");
  const [purchasePriceInput, setPurchasePriceInput] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState("すべて");
  const [query, setQuery] = useState("");
  const [newComment, setNewComment] = useState("");

  const selectedBook = books.find((b) => b.id === selectedId) || null;

  const totalBooks = books.length;
  const totalReads = books.reduce((s, b) => s + b.read_count, 0);
  const totalFavorites = books.filter((b) => b.favorite).length;
  const levelInfo = getLevelInfo(totalReads);
  const level = levelInfo.level;
  const levelProgress = levelInfo.progress * 100;

  const hasReadToday = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return readingLogs.some((l) => l.read_at.slice(0, 10) === todayKey);
  }, [readingLogs]);

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
    setPublisherInput("");
    setListPriceInput("");
    setPurchasePriceInput("");
    setScannedBadge(false);
    setScannedIsbn(null);
    setScannedCoverUrl(null);
    setScanStatus("idle");
    setAddMode("barcode");
    setTitleQuery("");
    setTitleResults([]);
    setTitleSearched(false);
    setEditingBookId(null);
  }

  function stopCameraScan() {
    controlsRef.current?.stop();
    controlsRef.current = null;
  }

  function openAddModal() {
    resetForm();
    setShowAddModal(true);
  }

  function openEditModal(book: Book) {
    resetForm();
    setEditingBookId(book.id);
    setForm({
      title: book.title,
      author: book.author ?? "",
      genre: book.genre,
      cover_color: book.cover_color,
      cover_emoji: book.cover_emoji,
    });
    setPublisherInput(book.publisher ?? "");
    setListPriceInput(book.list_price != null ? String(book.list_price) : "");
    setPurchasePriceInput(book.purchase_price != null ? String(book.purchase_price) : "");
    setScannedIsbn(book.isbn ?? null);
    setScannedCoverUrl(book.cover_image_url ?? null);
    setShowAddModal(true);
  }

  function closeAddModal() {
    stopCameraScan();
    setShowAddModal(false);
  }

  useEffect(() => {
    return () => stopCameraScan();
  }, []);

  async function startCameraScan() {
    setScanStatus("camera");
    scanLockRef.current = false;
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      if (!videoRef.current) return;
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result && !scanLockRef.current) {
            scanLockRef.current = true;
            handleBarcodeDetected(result.getText());
          }
        }
      );
      controlsRef.current = controls;
    } catch (err) {
      setScanStatus("camera_error");
    }
  }

  async function handleBarcodeDetected(text: string) {
    const digits = text.replace(/[^0-9]/g, "");
    const isBookBarcode =
      digits.length === 13 &&
      (digits.startsWith("978") || digits.startsWith("979"));

    if (!isBookBarcode) {
      scanLockRef.current = false;
      return;
    }

    stopCameraScan();
    setScanStatus("looking_up");

    try {
      const res = await fetch(`/api/isbn?isbn=${digits}`);
      if (!res.ok) {
        setScanStatus("not_found");
        return;
      }
      const data = await res.json();
      setForm((f) => ({
        ...f,
        title: data.title ?? f.title,
        author: data.author ?? "",
      }));
      setPublisherInput(data.publisher ?? "");
      setScannedIsbn(digits);
      setScannedCoverUrl(data.cover_image_url ?? null);
      setScanStatus("found");
      setScannedBadge(true);
    } catch {
      setScanStatus("not_found");
    }
  }

  async function handleTitleSearch() {
    if (!titleQuery.trim()) return;
    setTitleSearching(true);
    setTitleSearched(false);
    try {
      const res = await fetch(`/api/book-search?q=${encodeURIComponent(titleQuery.trim())}`);
      const data = await res.json();
      setTitleResults(data.results ?? []);
    } catch {
      setTitleResults([]);
    } finally {
      setTitleSearching(false);
      setTitleSearched(true);
    }
  }

  function handleSelectTitleResult(result: {
    isbn: string | null;
    title: string;
    author: string | null;
    publisher: string | null;
    cover_image_url: string | null;
  }) {
    setForm((f) => ({ ...f, title: result.title, author: result.author ?? "" }));
    setPublisherInput(result.publisher ?? "");
    setScannedIsbn(result.isbn);
    setScannedCoverUrl(result.cover_image_url);
    setScannedBadge(true);
    setTitleResults([]);
  }

  function submitBook(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setShowAddModal(false);
    const payload: NewBookInput = {
      ...form,
      publisher: publisherInput.trim() || undefined,
      list_price: listPriceInput ? Number(listPriceInput) : null,
      purchase_price: purchasePriceInput ? Number(purchasePriceInput) : null,
      isbn: scannedIsbn,
      cover_image_url: scannedCoverUrl,
    };

    if (editingBookId) {
      const id = editingBookId;
      const previous = books.find((b) => b.id === id);
      optimisticPatch(id, {
        title: payload.title,
        author: payload.author || null,
        genre: payload.genre,
        cover_color: payload.cover_color,
        cover_emoji: payload.cover_emoji,
        publisher: payload.publisher ?? null,
        list_price: payload.list_price ?? null,
        purchase_price: payload.purchase_price ?? null,
        isbn: payload.isbn ?? null,
        cover_image_url: payload.cover_image_url ?? null,
      });
      runAction(
        async () => {
          await updateBookDetails(id, payload);
        },
        () => {
          if (previous) optimisticPatch(id, previous);
        }
      );
    } else {
      runAction(async () => {
        await addBook(payload);
      });
    }
  }

  function optimisticPatch(id: string, patch: Partial<Book>) {
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
    );
  }

  function addReaderChip() {
    const name = readerInput.trim();
    if (name && !readersList.includes(name)) {
      setReadersList((prev) => [...prev, name]);
    }
    setReaderInput("");
  }

  function removeReaderChip(name: string) {
    setReadersList((prev) => prev.filter((n) => n !== name));
  }

  function handleAddRead(book: Book) {
    const next = book.read_count + 1;
    const minutes = readMinutes ? Number(readMinutes) : null;
    const readAtIso = new Date(`${readDate}T12:00:00`).toISOString();
    const readers = readerInput.trim()
      ? [...readersList, readerInput.trim()]
      : readersList;
    const tempLogId = `temp-${Date.now()}`;

    optimisticPatch(book.id, { read_count: next });
    setReadingLogs((prev) => [
      ...prev,
      {
        id: tempLogId,
        book_id: book.id,
        minutes,
        reading_type: readingType,
        readers: readers.length > 0 ? readers : null,
        completed: readCompleted,
        read_at: readAtIso,
      },
    ]);

    runAction(
      async () => {
        await logRead(book.id, book.read_count, {
          minutes,
          read_at: readAtIso,
          reading_type: readingType,
          readers,
          completed: readCompleted,
        });
      },
      () => {
        optimisticPatch(book.id, { read_count: book.read_count });
        setReadingLogs((prev) => prev.filter((l) => l.id !== tempLogId));
      }
    );

    setReadMinutes("");
    setReadersList([]);
    setReaderInput("");
    setReadCompleted(true);
    setReadDate(new Date().toISOString().slice(0, 10));
  }

  function handleSetRating(book: Book, rating: number) {
    const previousRating = book.rating;
    optimisticPatch(book.id, { rating });
    runAction(
      async () => {
        await updateBook(book.id, { rating });
      },
      () => optimisticPatch(book.id, { rating: previousRating })
    );
  }

  function handleToggleFavorite(book: Book) {
    const favorite = !book.favorite;
    optimisticPatch(book.id, { favorite });
    runAction(
      async () => {
        await updateBook(book.id, { favorite });
      },
      () => optimisticPatch(book.id, { favorite: !favorite })
    );
  }

  function handleAddComment(bookId: string) {
    if (!newComment.trim()) return;
    const text = newComment.trim();
    setNewComment("");
    runAction(async () => {
      await addComment(bookId, text);
    });
  }

  function handleDelete(id: string) {
    const previous = books.find((b) => b.id === id);
    const previousIndex = books.findIndex((b) => b.id === id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId(null);
    runAction(
      async () => {
        await deleteBook(id);
      },
      () => {
        if (previous) {
          setBooks((prev) => {
            const next = [...prev];
            next.splice(previousIndex, 0, previous);
            return next;
          });
        }
      }
    );
  }

  return (
    <div className="bh-app">
      <style>{`
        .bh-app { font-family: 'M PLUS Rounded 1c', sans-serif; background: linear-gradient(180deg, #EAF4FB 0%, #F3F8FC 320px, #F3F8FC 100%); min-height: 100vh; color: #33415C; padding-bottom: 80px; }
        .bh-header { padding: 24px 20px 18px; text-align: center; position: relative; }
        .bh-toolbar { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 10px; }
        .bh-signout { display: flex; align-items: center; gap: 4px; background: #fff; border: none; border-radius: 999px; padding: 6px 12px; font-size: 11px; color: #7A88A3; cursor: pointer; box-shadow: 0 2px 0 rgba(51,65,92,0.06); }
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
        .bh-nudge { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        .bh-nudge-inner { background: #FFF4E5; border-radius: 14px; padding: 10px 16px; font-size: 12px; color: #9A7B3F; text-align: center; }
        .bh-error-toast { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: #33415C; color: #fff; padding: 12px 20px; border-radius: 999px; font-size: 13px; font-weight: 700; box-shadow: 0 6px 16px rgba(0,0,0,0.2); z-index: 100; max-width: 90vw; text-align: center; }
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
        .bh-tabbar { display: flex; gap: 6px; margin-bottom: 14px; background: #EAF4FB; padding: 4px; border-radius: 14px; }
        .bh-tab { flex: 1; border: none; background: transparent; padding: 9px 8px; border-radius: 10px; font-family: inherit; font-weight: 700; font-size: 13px; color: #7A88A3; cursor: pointer; }
        .bh-tab.active { background: #fff; color: #33415C; box-shadow: 0 2px 0 rgba(51,65,92,0.08); }
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
        .bh-affiliate-wrap { text-align: center; margin-bottom: 16px; }
        .bh-affiliate-btn { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 2px solid #FFC94A; color: #33415C; text-decoration: none; font-weight: 700; font-size: 13px; padding: 8px 16px; border-radius: 999px; }
        .bh-pr-badge { background: #FFC94A; color: #7A5A00; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 999px; }
        .bh-affiliate-note { font-size: 10px; color: #B0BBCC; margin-top: 6px; }
        .bh-row-actions { display: flex; justify-content: center; gap: 14px; margin-bottom: 16px; }
        .bh-icon-btn { background: #fff; border: none; border-radius: 999px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 0 rgba(51,65,92,0.08); color: #B9CBDD; }
        .bh-icon-btn.on { color: #FF8FA0; }
        .bh-stars { display: flex; justify-content: center; gap: 4px; margin-bottom: 16px; }
        .bh-read-section { background: #EAF4FB; border-radius: 14px; padding: 12px 14px; margin-bottom: 16px; }
        .bh-read-type-row { display: flex; gap: 6px; justify-content: center; margin: 10px 0 8px; }
        .bh-type-btn { border: none; background: #fff; padding: 7px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #7A88A3; cursor: pointer; }
        .bh-type-btn.active { background: #7FB8E0; color: #fff; }
        .bh-read-row { display: flex; gap: 6px; justify-content: center; align-items: center; flex-wrap: wrap; margin-top: 8px; }
        .bh-read-date-input { border: 2px solid #E3ECF3; border-radius: 10px; padding: 6px 10px; font-family: inherit; font-size: 12px; outline: none; }
        .bh-readers-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
        .bh-reader-chip { background: #fff; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #33415C; display: inline-flex; align-items: center; gap: 4px; }
        .bh-reader-chip button { border: none; background: none; color: #B0BBCC; cursor: pointer; font-size: 12px; line-height: 1; padding: 0; }
        .bh-reader-input { border: 2px solid #E3ECF3; border-radius: 10px; padding: 6px 10px; font-family: inherit; font-size: 12px; outline: none; width: 110px; }
        .bh-completed-row { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; font-size: 12px; color: #33415C; font-weight: 700; }
        .bh-log-history { margin: 4px 0 16px; }
        .bh-log-item { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: 10px; padding: 8px 12px; font-size: 12px; margin-bottom: 6px; color: #33415C; }
        .bh-log-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; background: #EAF4FB; color: #33415C; flex-shrink: 0; }
        .bh-log-date { color: #7A88A3; font-size: 11px; flex-shrink: 0; }
        .bh-log-readers { color: #7A88A3; font-size: 11px; }
        .bh-comments-title { font-size: 12px; font-weight: 700; color: #7A88A3; margin-bottom: 8px; }
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
        <div className="bh-toolbar">
          <button className="bh-signout" onClick={() => setShowStats(true)}>
            <BarChart3 size={12} /> 統計
          </button>
          <button className="bh-signout" onClick={() => setShowShare(true)}>
            <Share2 size={12} /> シェア
          </button>
          <button className="bh-signout" onClick={() => setShowFamily(true)}>
            <Users size={12} /> 家族
          </button>
          <button
            className="bh-signout"
            title={userEmail}
            onClick={() => {
              if (window.confirm("ログアウトしますか？次にログインするには、もう一度メールでの認証が必要です。")) {
                startTransition(async () => await signOut());
              }
            }}
          >
            <LogOut size={12} /> ログアウト
          </button>
        </div>
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
            <span>としょかん Lv.{level}（{levelInfo.title}）</span>
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

      {books.length > 0 && !hasReadToday && (
        <div className="bh-nudge">
          <div className="bh-nudge-inner">
            📖 きょうはまだ記録がありません。1冊読んで記録をつけてみませんか？
          </div>
        </div>
      )}

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

      <RecommendedBooks />

      <button className="bh-fab" onClick={openAddModal}>
        <Plus size={18} /> ほんをふやす
      </button>

      {showAddModal && (
        <div className="bh-modal-backdrop" onClick={closeAddModal}>
          <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bh-modal-close" onClick={closeAddModal}><X size={16} /></button>
            <div className="bh-modal-title">
              <Sparkles size={18} color="#FFC94A" /> {editingBookId ? "本を編集する" : "本を登録する"}
            </div>

            {!editingBookId && (
              <>
                <div className="bh-tabbar">
                  <button type="button" className={`bh-tab ${addMode === "barcode" ? "active" : ""}`} onClick={() => setAddMode("barcode")}>
                    📷 バーコード
                  </button>
                  <button type="button" className={`bh-tab ${addMode === "title" ? "active" : ""}`} onClick={() => setAddMode("title")}>
                    🔍 タイトルで検索
                  </button>
                </div>

                {addMode === "barcode" && (
                  <>
                    {scanStatus === "idle" && (
                      <div className="bh-scan-box">
                        <ScanLine size={30} color="#7FB8E0" style={{ margin: "0 auto", display: "block" }} />
                        <div style={{ marginTop: 8, fontSize: 12, color: "#7A88A3" }}>本のバーコード（ISBN）をカメラで読み取ります</div>
                        <button className="bh-scan-btn" type="button" onClick={startCameraScan}>
                          <ScanLine size={14} /> カメラでスキャンする
                        </button>
                      </div>
                    )}

                    {scanStatus === "camera" && (
                      <div className="bh-scan-box" style={{ padding: 12 }}>
                        <video ref={videoRef} muted playsInline autoPlay style={{ width: "100%", borderRadius: 12, display: "block" }} />
                        <div style={{ marginTop: 8, fontSize: 12, color: "#7A88A3" }}>裏表紙のバーコードを枠内に映してください</div>
                        <button
                          className="bh-scan-btn"
                          type="button"
                          style={{ background: "#B0BBCC", boxShadow: "0 4px 0 #8B97A8" }}
                          onClick={() => { stopCameraScan(); setScanStatus("idle"); }}
                        >
                          キャンセル
                        </button>
                      </div>
                    )}

                    {scanStatus === "looking_up" && (
                      <div className="bh-scan-box">
                        <div className="bh-scan-pulse" />
                        <div style={{ marginTop: 10, fontSize: 13, color: "#7A88A3" }}>書籍情報を検索中...</div>
                      </div>
                    )}

                    {scanStatus === "not_found" && (
                      <div className="bh-scan-box">
                        <div style={{ fontSize: 13, color: "#D98A8A", marginBottom: 10 }}>😢 見つかりませんでした。「タイトルで検索」タブか、下のフォームに手入力してください</div>
                        <button className="bh-scan-btn" type="button" onClick={startCameraScan}>
                          <ScanLine size={14} /> もう一度スキャン
                        </button>
                      </div>
                    )}

                    {scanStatus === "camera_error" && (
                      <div className="bh-scan-box">
                        <div style={{ fontSize: 13, color: "#D98A8A" }}>カメラを起動できませんでした。ブラウザのカメラ許可設定をご確認いただくか、下のフォームに手入力してください。</div>
                      </div>
                    )}

                    {scanStatus === "found" && scannedCoverUrl && (
                      <div style={{ textAlign: "center", marginBottom: 10 }}>
                        <img src={scannedCoverUrl} alt="表紙" style={{ height: 90, borderRadius: 8, boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }} />
                      </div>
                    )}
                  </>
                )}

                {addMode === "title" && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: "#7A88A3", marginBottom: 8 }}>
                      図書館で借りた本など、バーコードが手元にない場合はタイトルで探せます
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        placeholder="本のタイトルを入力"
                        value={titleQuery}
                        onChange={(e) => setTitleQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleTitleSearch())}
                        style={{ flex: 1, border: "2px solid #E3ECF3", borderRadius: 10, padding: "9px 12px", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                      />
                      <button type="button" className="bh-scan-btn" style={{ marginTop: 0 }} onClick={handleTitleSearch}>
                        <Search size={14} /> 検索
                      </button>
                    </div>

                    {titleSearching && (
                      <div style={{ fontSize: 12, color: "#7A88A3", marginTop: 10 }}>検索中...</div>
                    )}

                    {!titleSearching && titleSearched && titleResults.length === 0 && (
                      <div style={{ fontSize: 12, color: "#D98A8A", marginTop: 10 }}>見つかりませんでした。下のフォームに手入力してください</div>
                    )}

                    {titleResults.length > 0 && (
                      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
                        {titleResults.map((r, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => handleSelectTitleResult(r)}
                            style={{ display: "flex", gap: 10, alignItems: "center", background: "#fff", border: "none", borderRadius: 10, padding: 8, textAlign: "left", cursor: "pointer" }}
                          >
                            {r.cover_image_url ? (
                              <img src={r.cover_image_url} alt="" style={{ width: 32, height: 44, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 32, height: 44, background: "#EAF4FB", borderRadius: 4, flexShrink: 0 }} />
                            )}
                            <div style={{ fontSize: 12 }}>
                              <div style={{ fontWeight: 700, color: "#33415C" }}>{r.title}</div>
                              <div style={{ color: "#7A88A3", fontSize: 11 }}>{r.author}{r.publisher ? ` / ${r.publisher}` : ""}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {scannedBadge && <span className="bh-scanned-badge">📷 自動入力されました（内容は下で編集できます）</span>}

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
                <label>出版社（任意）</label>
                <input value={publisherInput} onChange={(e) => setPublisherInput(e.target.value)} placeholder="例：福音館書店" />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="bh-field" style={{ flex: 1 }}>
                  <label>定価（円・任意）</label>
                  <input type="number" min="0" value={listPriceInput} onChange={(e) => setListPriceInput(e.target.value)} placeholder="1200" />
                </div>
                <div className="bh-field" style={{ flex: 1 }}>
                  <label>購入価格（円・任意）</label>
                  <input type="number" min="0" value={purchasePriceInput} onChange={(e) => setPurchasePriceInput(e.target.value)} placeholder="980" />
                </div>
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
                {isPending ? "保存中..." : editingBookId ? "この内容で保存する" : "この内容で登録する"}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedBook && (
        <div className="bh-modal-backdrop" onClick={() => setSelectedId(null)}>
          <div className="bh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bh-modal-close" onClick={() => setSelectedId(null)}><X size={16} /></button>

            <div
              className="bh-detail-cover"
              style={{
                background: selectedBook.cover_image_url ? "#fff" : selectedBook.cover_color,
                overflow: "hidden",
                padding: 0,
              }}
            >
              {selectedBook.cover_image_url ? (
                <img
                  src={selectedBook.cover_image_url}
                  alt={selectedBook.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                selectedBook.cover_emoji
              )}
            </div>
            <div className="bh-detail-title">{selectedBook.title}</div>
            <div className="bh-detail-author">{selectedBook.author}</div>
            <div className="bh-genre-tag">{selectedBook.genre}</div>

            <div className="bh-affiliate-wrap">
              <a
                className="bh-affiliate-btn"
                href={buildRakutenBookLink({ isbn: selectedBook.isbn, title: selectedBook.title })}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                🛒 楽天ブックスで探す <span className="bh-pr-badge">PR</span>
              </a>
              <div className="bh-affiliate-note">
                このリンクから購入すると、運営者に紹介料が入ることがあります
              </div>
            </div>

            <div className="bh-row-actions">
              <button className={`bh-icon-btn ${selectedBook.favorite ? "on" : ""}`} onClick={() => handleToggleFavorite(selectedBook)}>
                <Heart size={18} fill={selectedBook.favorite ? "#FF8FA0" : "none"} />
              </button>
              <button className="bh-icon-btn" onClick={() => { setSelectedId(null); openEditModal(selectedBook); }}>
                <PencilLine size={16} />
              </button>
              <button className="bh-icon-btn" onClick={() => { setSelectedId(null); setShareBookId(selectedBook.id); }}>
                <Share2 size={16} />
              </button>
            </div>

            <div className="bh-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => handleSetRating(selectedBook, n)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <Star size={22} fill={n <= selectedBook.rating ? "#FFC94A" : "none"} color={n <= selectedBook.rating ? "#FFC94A" : "#D8DFE8"} />
                </button>
              ))}
            </div>

            <div className="bh-read-section" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#7A88A3", fontWeight: 700 }}>よんだ回数</div>
              <div className="bh-read-count">{selectedBook.read_count} 回</div>

              <div className="bh-read-type-row">
                <button
                  type="button"
                  className={`bh-type-btn ${readingType === "self_read" ? "active" : ""}`}
                  onClick={() => setReadingType("self_read")}
                >
                  📗 一人読み
                </button>
                <button
                  type="button"
                  className={`bh-type-btn ${readingType === "read_aloud" ? "active" : ""}`}
                  onClick={() => setReadingType("read_aloud")}
                >
                  📖 読み聞かせ
                </button>
              </div>

              <div className="bh-read-row">
                <input
                  type="date"
                  className="bh-read-date-input"
                  value={readDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setReadDate(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="分（任意）"
                  value={readMinutes}
                  onChange={(e) => setReadMinutes(e.target.value)}
                  style={{ width: 80, border: "2px solid #E3ECF3", borderRadius: 10, padding: "6px 10px", fontFamily: "inherit", fontSize: 12, outline: "none" }}
                />
              </div>

              {familyMembers.length > 0 && (
                <div className="bh-readers-row" style={{ marginTop: 10 }}>
                  {familyMembers.map((m) => {
                    const selected = readersList.includes(m.name);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        className="bh-reader-chip"
                        style={{
                          background: selected ? "#33415C" : "#fff",
                          color: selected ? "#fff" : "#33415C",
                          cursor: "pointer",
                          border: "none",
                        }}
                        onClick={() => {
                          setReadersList((prev) =>
                            selected
                              ? prev.filter((n) => n !== m.name)
                              : [...prev, m.name]
                          );
                        }}
                      >
                        {m.emoji} {m.name}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="bh-readers-row">
                {readersList
                  .filter((name) => !familyMembers.some((m) => m.name === name))
                  .map((name) => (
                    <span className="bh-reader-chip" key={name}>
                      {name}
                      <button type="button" onClick={() => removeReaderChip(name)}><X size={10} /></button>
                    </span>
                  ))}
                <input
                  className="bh-reader-input"
                  placeholder="その他の名前を追加"
                  value={readerInput}
                  onChange={(e) => setReaderInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addReaderChip();
                    }
                  }}
                  onBlur={addReaderChip}
                />
              </div>

              <label className="bh-completed-row">
                <input
                  type="checkbox"
                  checked={readCompleted}
                  onChange={(e) => setReadCompleted(e.target.checked)}
                />
                さいごまで読んだ（読了）
              </label>

              <button className="bh-read-btn" style={{ marginTop: 12 }} onClick={() => handleAddRead(selectedBook)}>
                この内容で記録する +1
              </button>
            </div>

            <div className="bh-comments-title">読書記録</div>
            <div className="bh-log-history">
              {readingLogs.filter((l) => l.book_id === selectedBook.id).length === 0 ? (
                <div style={{ fontSize: 12, color: "#B0BBCC", marginBottom: 8 }}>まだ記録がありません</div>
              ) : (
                readingLogs
                  .filter((l) => l.book_id === selectedBook.id)
                  .sort((a, b) => b.read_at.localeCompare(a.read_at))
                  .slice(0, 8)
                  .map((log) => (
                    <div className="bh-log-item" key={log.id}>
                      <span className="bh-log-date">{log.read_at.slice(0, 10)}</span>
                      <span className="bh-log-badge">
                        {log.reading_type === "read_aloud" ? "📖 読み聞かせ" : "📗 一人読み"}
                      </span>
                      {log.minutes ? <span className="bh-log-badge">{log.minutes}分</span> : null}
                      {!log.completed && <span className="bh-log-badge">途中</span>}
                      {log.readers && log.readers.length > 0 && (
                        <span className="bh-log-readers">{log.readers.join("・")}</span>
                      )}
                    </div>
                  ))
              )}
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

            <RelatedBooks
              author={selectedBook.author}
              genre={selectedBook.genre}
              currentTitle={selectedBook.title}
            />

            <div className="bh-delete-row">
              <button className="bh-delete-link" onClick={() => handleDelete(selectedBook.id)}>
                <Trash2 size={12} /> この本を削除する
              </button>
            </div>
          </div>
        </div>
      )}
      {showFamily && (
        <FamilyModal
          members={familyMembers}
          onAdd={(name, emoji) => {
            const temp: FamilyMember = { id: `temp-${Date.now()}`, name, emoji };
            setFamilyMembers((prev) => [...prev, temp]);
            runAction(
              async () => {
                await addFamilyMember(name, emoji);
              },
              () => setFamilyMembers((prev) => prev.filter((m) => m.id !== temp.id))
            );
          }}
          onDelete={(id) => {
            const previous = familyMembers.find((m) => m.id === id);
            setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
            runAction(
              async () => {
                await deleteFamilyMember(id);
              },
              () => {
                if (previous) setFamilyMembers((prev) => [...prev, previous]);
              }
            );
          }}
          onClose={() => setShowFamily(false)}
        />
      )}

      {showShare && (
        <ShareModal
          heading="実績をシェアする"
          buildShareText={(familyName) => {
            const monthCount = readingLogs.filter((l) => {
              const d = new Date(l.read_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length;
            return `${familyName ? familyName + "の" : ""}今月${monthCount}冊読みました📚 #ブックホーム`;
          }}
          buildImage={(familyName) => {
            const monthCount = readingLogs.filter((l) => {
              const d = new Date(l.read_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length;
            return generateShareImage({
              familyName,
              monthCount,
              totalBooks,
              level,
              levelTitle: levelInfo.title,
            });
          }}
          onClose={() => setShowShare(false)}
        />
      )}

      {shareBookId && (() => {
        const book = books.find((b) => b.id === shareBookId);
        if (!book) return null;
        const latestComment = book.book_comments[book.book_comments.length - 1]?.text ?? null;
        return (
          <ShareModal
            heading="この本をシェアする"
            buildShareText={(familyName) =>
              `${familyName ? familyName + "が" : ""}「${book.title}」を読みました📚 #ブックホーム`
            }
            buildImage={(familyName) =>
              generateBookShareImage({
                familyName,
                title: book.title,
                author: book.author,
                genre: book.genre,
                rating: book.rating,
                coverColor: book.cover_color,
                coverEmoji: book.cover_emoji,
                comment: latestComment,
              })
            }
            onClose={() => setShareBookId(null)}
          />
        );
      })()}

      {showStats && (
        <StatsModal
          books={books}
          readingLogs={readingLogs}
          familyMembers={familyMembers}
          annualGoal={settings.annual_goal}
          onSaveGoal={(goal) => {
            const previous = settings.annual_goal;
            setSettings({ annual_goal: goal });
            runAction(
              async () => {
                await updateAnnualGoal(goal);
              },
              () => setSettings({ annual_goal: previous })
            );
          }}
          onClose={() => setShowStats(false)}
        />
      )}

      {errorToast && <div className="bh-error-toast">⚠️ {errorToast}</div>}
    </div>
  );
}
