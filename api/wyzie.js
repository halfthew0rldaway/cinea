export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing path parameter" });
  }

  const apiKey = process.env.WYZIE_API_KEY || "wyzie-7uddqpan1wi2rmg66ejer41g6xghetu9";
  
  const searchParams = new URLSearchParams(queryParams);
  searchParams.set("key", apiKey);
  const queryString = searchParams.toString();

  const url = `https://sub.wyzie.io${path}?${queryString}`;

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
