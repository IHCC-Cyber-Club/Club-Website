export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { title, date, content, filename } = req.body;
  const token = process.env.GITHUB_TOKEN; // Pulls from your Vercel Environment Variables
  const repoPath = 'IHCC-Cyber-Club/Club-Website';

  // We are forcing the forward slash here to override the VS Code auto-backslash
  const filePath = `contents/notes/${filename}`;

  const fileContent = `---\ntitle: "${title}"\ndate: "${date}"\n---\n\n${content}`;
  const encodedContent = Buffer.from(fileContent).toString('base64');

  try {
    const response = await fetch(`https://api.github.com/repos/${repoPath}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Automated upload: ${title}`,
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