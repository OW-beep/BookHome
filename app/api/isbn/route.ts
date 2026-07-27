import { NextRequest, NextResponse } from "next/server";
import { lookupOpenBD, lookupGoogleBooksByIsbn } from "@/lib/bookLookup";

export async function GET(request: NextRequest) {
  const isbn = request.nextUrl.searchParams.get("isbn")?.replace(/[^0-9X]/gi, "");

  if (!isbn || (isbn.length !== 13 && isbn.length !== 10)) {
    return NextResponse.json(
      { error: "有効なISBNではありません" },
      { status: 400 }
    );
  }

  const result = (await lookupOpenBD(isbn)) ?? (await lookupGoogleBooksByIsbn(isbn));

  if (!result) {
    return NextResponse.json(
      { error: "書籍情報が見つかりませんでした" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
