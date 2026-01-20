export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { title, date, time, attendance, content, filename } = req.body;
  const token = process.env.GITHUB_TOKEN; 
  const repoPath = 'IHCC-Cyber-Club/Club-Website';

  // THE HTML TEMPLATE (Based on your exact code)
  const fullHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Minutes • ${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../assets/styles.css">
</head>
<body>
  <div id="bg"></div>
  <div class="page">
    <div class="nav">
      <div class="nav-inner">
        <div class="brand">IHCC Cybersecurity Club</div>
        <div class="navlinks">
          <a href="../../index.html">Home</a>
          <a href="../../about.html">About</a>
          <a class="active" href="../../notes.html">Notes</a>
        </div>
      </div>
    </div>
    <section class="minutes">
      <div class="container">
        <a class="back-btn" href="../../notes.html">Back</a>
        <div class="minutes-doc">
          <p class="minutes-line"><span class="minutes-label">Date:</span> ${date}</p>
          <p class="minutes-line"><span class="minutes-label">Time:</span> ${time}</p>
          <p class="minutes-line"><span class="minutes-label">Attendance:</span> ${attendance}</p>
          <div class="minutes-section-title">Topics Discussed:</div>
          ${content}
        </div>
      </div>
    </section>
    <footer class="footer">
      <div style="font-weight:900;">IHCC Cyber</div>
      <div class="mini">
        <a href="../../index.html">Home</a>
        <a href="../../about.html">About</a>
        <a href="../../notes.html">Notes</a>
      </div>
    </footer>
  </div>
  <script type="module">
    import { startBackgroundNet } from "../../assets/bg-network.js";
    startBackgroundNet("bg");
  </script>
</body>
</html>`;

  const encodedContent = Buffer.from(fullHtml).toString('base64');

  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}/contents/contents/notes/${filename}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Create Minutes: ${title}`,
        content: encodedContent,
        branch: 'main'
      })
    });

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      const err = await response.json();
      res.status(500).json({ error: err.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}