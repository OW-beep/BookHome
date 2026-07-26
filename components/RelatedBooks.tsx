"use client";

import { useEffect, useState } from "react";
import { pickByGenre, RecommendedBook } from "@/lib/recommendations";
import { buildRakutenBookLink } from "@/lib/affiliate";

type AuthorBook = { title: string; coverImageUrl: string | null };
type Product = { title: string; price: number; imageUrl: string | null; url: string };

export default function RelatedBooks({
  author,
  genre,
  currentTitle,
}: {
  author: string | null;
  genre: string;
  currentTitle: string;
}) {
  const [authorBooks, setAuthorBooks] = useState<AuthorBook[]>([]);
  const [loadingAuthor, setLoadingAuthor] = useState(!!author);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/related-products?keyword=${encodeURIComponent(currentTitle)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [currentTitle]);

  useEffect(() => {
    if (!author) {
      setLoadingAuthor(false);
      return;
    }
    let cancelled = false;
    fetch(`/api/author-books?author=${encodeURIComponent(author)}&exclude=${encodeURIComponent(currentTitle)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAuthorBooks(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setAuthorBooks([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingAuthor(false);
      });
    return () => {
      cancelled = true;
    };
  }, [author, currentTitle]);

  const similarGenre = pickByGenre(genre, currentTitle, 3);

  if (authorBooks.length === 0 && similarGenre.length === 0 && products.length === 0 && !loadingAuthor) {
    return null;
  }

  return (
    <div className="related-wrap">
      <style>{`
        .related-wrap { margin: 4px 0 16px; }
        .related-section-title { font-size: 11px; font-weight: 700; color: #7A88A3; margin-bottom: 6px; }
        .related-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 12px; }
        .related-card { flex-shrink: 0; width: 90px; text-decoration: none; color: #33415C; text-align: center; }
        .related-cover-img { width: 70px; height: 92px; object-fit: cover; border-radius: 6px; background: #EAF4FB; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .related-cover-emoji { width: 70px; height: 92px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto; }
        .related-card-title { font-size: 10px; font-weight: 700; margin-top: 4px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      {authorBooks.length > 0 && (
        <>
          <div className="related-section-title">同じ作者のほかの作品</div>
          <div className="related-row">
            {authorBooks.map((b) => (
              <a
                key={b.title}
                className="related-card"
                href={buildRakutenBookLink({ title: b.title })}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                {b.coverImageUrl ? (
                  <img className="related-cover-img" src={b.coverImageUrl} alt={b.title} />
                ) : (
                  <div className="related-cover-emoji" style={{ background: "#EAF4FB" }}>📕</div>
                )}
                <div className="related-card-title">{b.title}</div>
              </a>
            ))}
          </div>
        </>
      )}

      {similarGenre.length > 0 && (
        <>
          <div className="related-section-title">この本が好きな人はこちらも</div>
          <div className="related-row">
            {similarGenre.map((b: RecommendedBook) => (
              <a
                key={b.title}
                className="related-card"
                href={buildRakutenBookLink({ title: `${b.title} ${b.author}` })}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                <div className="related-cover-emoji" style={{ background: "#FFF4E5" }}>{b.emoji}</div>
                <div className="related-card-title">{b.title}</div>
              </a>
            ))}
          </div>
        </>
      )}

      {products.length > 0 && (
        <>
          <div className="related-section-title">関連グッズ <span style={{ background: "#F1F1EC", color: "#9A9A8F", fontSize: 9, fontWeight: 900, padding: "1px 6px", borderRadius: 999 }}>PR</span></div>
          <div className="related-row">
            {products.map((p) => (
              <a
                key={p.title}
                className="related-card"
                href={p.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
              >
                {p.imageUrl ? (
                  <img className="related-cover-img" src={p.imageUrl} alt={p.title} />
                ) : (
                  <div className="related-cover-emoji" style={{ background: "#EAF4FB" }}>🎁</div>
                )}
                <div className="related-card-title">{p.title}</div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
