"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { FamilyMember } from "@/lib/types";

const MEMBER_EMOJIS = ["👨", "👩", "👧", "👦", "🧑", "👶", "🐶", "🐱", "👴", "👵"];

export default function FamilyModal({
  members,
  onAdd,
  onDelete,
  onClose,
}: {
  members: FamilyMember[];
  onAdd: (name: string, emoji: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(MEMBER_EMOJIS[0]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), emoji);
    setName("");
  }

  return (
    <div className="family-backdrop" onClick={onClose}>
      <style>{`
        .family-backdrop { position: fixed; inset: 0; background: rgba(51,65,92,0.35); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 60; }
        .family-modal { background: #FFFBF3; border-radius: 24px; max-width: 400px; width: 100%; max-height: 88vh; overflow-y: auto; padding: 22px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .family-close { position: absolute; top: 16px; right: 16px; background: #EAF4FB; border: none; border-radius: 999px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #33415C; }
        .family-title { font-family: 'Zen Maru Gothic', sans-serif; font-weight: 900; font-size: 18px; margin-bottom: 6px; color: #33415C; }
        .family-sub { font-size: 12px; color: #7A88A3; margin-bottom: 16px; }
        .family-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .family-item { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 12px; padding: 8px 12px; }
        .family-item-emoji { font-size: 20px; }
        .family-item-name { flex: 1; font-size: 13px; font-weight: 700; color: #33415C; }
        .family-item-delete { background: none; border: none; color: #D98A8A; cursor: pointer; }
        .family-empty { font-size: 12px; color: #B0BBCC; margin-bottom: 16px; }
        .family-add-form { border-top: 1px solid #E3ECF3; padding-top: 14px; }
        .family-emoji-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
        .family-emoji-btn { font-size: 18px; background: #EAF4FB; border: 2px solid transparent; border-radius: 8px; padding: 4px 7px; cursor: pointer; }
        .family-emoji-btn.selected { border-color: #33415C; }
        .family-add-row { display: flex; gap: 6px; }
        .family-add-row input { flex: 1; border: 2px solid #E3ECF3; border-radius: 10px; padding: 9px 12px; font-family: inherit; font-size: 14px; outline: none; }
        .family-add-row button { background: #33415C; color: #fff; border: none; border-radius: 10px; padding: 0 14px; cursor: pointer; display: flex; align-items: center; }
      `}</style>
      <div className="family-modal" onClick={(e) => e.stopPropagation()}>
        <button className="family-close" onClick={onClose}><X size={16} /></button>
        <div className="family-title">👪 家族メンバー</div>
        <div className="family-sub">
          読書記録の「読んだ人」欄に表示されます。パパ・ママ・お子さんなど登録しておくと、毎回入力せずに選べて、家族ランキングにも反映されます。
        </div>

        {members.length === 0 ? (
          <div className="family-empty">まだ登録されていません</div>
        ) : (
          <div className="family-list">
            {members.map((m) => (
              <div className="family-item" key={m.id}>
                <span className="family-item-emoji">{m.emoji}</span>
                <span className="family-item-name">{m.name}</span>
                <button className="family-item-delete" onClick={() => onDelete(m.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form className="family-add-form" onSubmit={handleAdd}>
          <div className="family-emoji-row">
            {MEMBER_EMOJIS.map((em) => (
              <button
                type="button"
                key={em}
                className={`family-emoji-btn ${emoji === em ? "selected" : ""}`}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
          <div className="family-add-row">
            <input
              placeholder="名前（例：長女、パパ）"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit"><Plus size={16} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}
