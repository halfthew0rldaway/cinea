export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const searchParams = new URLSearchParams(queryParams);
  const queryString = searchParams.toString();
  const url = `https://api.themoviedb.org/3${path}${queryString ? `?${queryString}` : ""}`;
  
  // Fallback to embedded key so it works out-of-the-box on Vercel
  const apiKey = process.env.TMDB_API_KEY || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2ZiZWFkMDg1MjcxMGQxZGIzOTY1NjEwZDMwOTEzNSIsIm5iZiI6MTc3MDQwNjA0OS44MjMsInN1YiI6IjY5ODY0MGExZWU0MGM0ZmI4YzY5MTgzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yxLuQ_Kt7U689x20Y8BEXKrFcTlUowczJESY4g8g8hg";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    
    // Cache for 24 hours to match the 24 hours cache TTL on the client side
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
