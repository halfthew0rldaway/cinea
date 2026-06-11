export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  // Get path and all query params
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = urlObj.searchParams;
  searchParams.delete('path'); // Remove the next.js routing param
  const apiKey = process.env.WYZIE_API_KEY;
  searchParams.set('key', apiKey); // inject the secret key

  const url = `https://sub.wyzie.io${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
