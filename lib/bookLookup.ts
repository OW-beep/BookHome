export type BookLookupResult = {
  isbn: string;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_image_url: string | null;
};

export async function lookupOpenBD(
  isbn: string
): Promise<BookLookupResult | null> {
  try {
    const res = await fetch(
      `https://api.openbd.jp/v1/get?isbn=${encodeURIComponent(isbn)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = Array.isArray(data) ? data[0] : null;
    if (!item || !item.summary) return null;

    const s = item.summary;
    if (!s.title) return null;

    return {
      isbn,
      title: s.title,
      author: s.author || null,
      publisher: s.publisher || null,
      cover_image_url: s.cover || null,
    };
  } catch {
    return null;
  }
}

export async function lookupGoogleBooksByIsbn(
  isbn: string
): Promise<BookLookupResult | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
        isbn
      )}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.items?.[0];
    if (!item?.volumeInfo?.title) return null;

    const info = item.volumeInfo;
    return {
      isbn,
      title: info.title,
      author: Array.isArray(info.authors) ? info.authors.join(", ") : null,
      publisher: info.publisher || null,
      cover_image_url: info.imageLinks?.thumbnail || null,
    };
  } catch {
    return null;
  }
}
