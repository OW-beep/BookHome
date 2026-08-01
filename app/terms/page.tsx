export const metadata = { title: "利用規約｜ブックホーム" };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", fontFamily: "'M PLUS Rounded 1c', sans-serif", color: "#33415C", lineHeight: 1.8 }}>
      <h1 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 24 }}>利用規約</h1>
      <p style={{ fontSize: 13, color: "#7A88A3" }}>最終更新日：2026年8月2日</p>

      <p>
        この利用規約（以下「本規約」）は、運営者（以下「当方」）が提供する読書記録サービス「ブックホーム」
        （以下「本サービス」）の利用条件を定めるものです。利用者は、本サービスを利用することで本規約に同意したものとみなします。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第1条（サービス内容）</h2>
      <p>
        本サービスは、本の登録・読書記録・統計表示等の機能を無料で提供します。
        当方は、事前の通知なく機能の追加・変更・停止を行うことがあります。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第2条（アカウント）</h2>
      <p>
        利用者は、正確なメールアドレスを用いてアカウントを登録するものとします。
        アカウントの管理責任は利用者本人が負うものとし、第三者への譲渡・貸与はできません。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第3条（禁止事項）</h2>
      <p>利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
      <ul>
        <li>法令または公序良俗に違反する行為</li>
        <li>本サービスの運営を妨害する行為</li>
        <li>他の利用者または第三者の権利を侵害する行為</li>
        <li>不正アクセスその他本サービスのシステムに影響を与える行為</li>
      </ul>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第4条（登録情報の正確性）</h2>
      <p>
        本サービスに登録される書籍情報（タイトル・著者・価格等）は、外部の書誌データベースや
        利用者自身の入力に基づくものであり、当方はその正確性を保証するものではありません。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第5条（外部リンク・アフィリエイト）</h2>
      <p>
        本サービスは、楽天ブックス等の外部サイトへのリンク（アフィリエイトリンクを含む）を提供します。
        リンク先での取引・トラブルについて、当方は責任を負いません。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第6条（免責事項）</h2>
      <p>
        当方は、本サービスの利用によって生じた損害（データの消失・機能の一時停止等を含む）について、
        法令上許容される範囲で責任を負わないものとします。
        本サービスは開発中の機能を含むため、予告なく仕様が変更される場合があります。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第7条（未成年の利用）</h2>
      <p>
        未成年の方が本サービスを利用する場合は、保護者の同意および管理のもとでご利用ください。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第8条（サービスの変更・終了）</h2>
      <p>
        当方は、利用者への事前の通知をもって、本サービスの全部または一部を変更・終了することができるものとします。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第9条（規約の変更）</h2>
      <p>
        当方は、必要と判断した場合、利用者への通知なく本規約を変更できるものとします。
        変更後の規約は、本サービス上に表示した時点から効力を生じます。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>第10条（準拠法・管轄）</h2>
      <p>
        本規約の解釈にあたっては、日本法を準拠法とします。
        本サービスに関して紛争が生じた場合、当方の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
      </p>

      <h2 style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 18, marginTop: 32 }}>お問い合わせ</h2>
      <p>
        本規約に関するお問い合わせは、<a href="mailto:bookhome26.info@gmail.com" style={{ color: "#7FB8E0" }}>bookhome26.info@gmail.com</a> までお願いします。
        通常、3〜5営業日以内に返信いたします。
      </p>

      <p style={{ marginTop: 40 }}><a href="/" style={{ color: "#7FB8E0" }}>← トップページに戻る</a></p>
    </div>
  );
}
