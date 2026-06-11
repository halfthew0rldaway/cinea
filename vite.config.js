import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // The secure API keys for local dev (Vercel uses its own env vars)
  const TMDB_KEY = process.env.TMDB_API_KEY || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2ZiZWFkMDg1MjcxMGQxZGIzOTY1NjEwZDMwOTEzNSIsIm5iZiI6MTc3MDQwNjA0OS44MjMsInN1YiI6IjY5ODY0MGExZWU0MGM0ZmI4YzY5MTgzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yxLuQ_Kt7U689x20Y8BEXKrFcTlUowczJESY4g8g8hg";
  const WYZIE_KEY = process.env.WYZIE_API_KEY || "wyzie-7uddqpan1wi2rmg66ejer41g6xghetu9";

  return {
    plugins: [react()],
    base: "./",
    server: {
      proxy: {
        "/api/tmdb": {
          target: "https://api.themoviedb.org/3",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/tmdb/, ""),
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              proxyReq.setHeader("Authorization", `Bearer ${TMDB_KEY}`);
            });
          },
        },
        "/api/wyzie": {
          target: "https://sub.wyzie.io",
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(/^\/api\/wyzie/, "");
            const joiner = newPath.includes("?") ? "&" : "?";
            return newPath + joiner + `key=${WYZIE_KEY}`;
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom"],
            settings: ["./src/pages/SettingsPage"],
            movie: ["./src/pages/MoviePage"],
            tv: ["./src/pages/TVPage"],
            downloads: ["./src/pages/DownloadsPage"],
          },
        },
      },
    },
  };
});
