import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const author = request.nextUrl.searchParams.get("author")?.trim();
  const excludeTitle = request.nextUrl.searchParams.get("exclude")?.trim();

  if (!author) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        `inauthor:"${author}"`
      )}&maxResults=8&country=JP`,
      { cache: "no-store" }
    );
    if (!res.ok) return NextResponse.json({ results: [] });

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    const results = items
      .filter((item: any) => item?.volumeInfo?.title)
      .filter((item: any) => item.volumeInfo.title !== excludeTitle)
      .map((item: any) => ({
        title: item.volumeInfo.title as string,
        coverImageUrl: (item.volumeInfo.imageLinks?.thumbnail || null) as
          | string
          | null,
      }))
      .slice(0, 4);

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
