/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // 過去の作業中に一時的に公開されていた記事の旧URL。
        // 現在は同じテーマに一番近い記事へリダイレクトする。
        source: "/articles/kyodai-yomikikase-kufu",
        destination: "/articles/ehon-osusume-nenreibetsu",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
