🛡️ IHCC Cyber Club Website Management
Welcome to the IHCC Cyber Club web team! This website is designed to be modular so that club officers can update meeting notes without needing to touch the HTML code.

📝 How to Add Meeting Notes (The Easy Way)
You do not need to edit notes.html to add new meetings. Follow these steps:

Login: Go to [YOUR-URL]/admin (e.g., https://test-site-ruby-tau.vercel.app/admin).

Authenticate: Click the "Login with GitHub" button.

Create: Click the "New Meeting Notes" button.

Fill Details: * Title: e.g., "Introduction to Subnetting"

Date: Select the meeting date.

Body: Write the notes using Markdown (the editor has a toolbar for bold, links, etc.).

Publish: Click Save and then Publish.

What happens next? GitHub will automatically create a new file in content/notes/, and Vercel will rebuild the site. The "Notes" tab on the live site will update automatically with the new entry.

🛠️ Maintenance for Developers
If you are the "Web Master" or technical lead, here is how the system works:

The Architecture
CMS: We use Decap CMS (configured in /admin/config.yml). It acts as a bridge between the browser and GitHub.

Content: All meeting notes are stored as .md (Markdown) files in /content/notes/.

Auto-Update: The notes.html file contains a JavaScript "Auto-Loader" script. This script uses the GitHub API to fetch the list of files in /content/notes/ and renders them onto the page using the club's CSS styling.

Hand-off Checklist (When you graduate)
GitHub Access: Ensure the new lead has "Admin" or "Maintainer" access to the GitHub Repository.

Vercel Access: Transfer the Vercel project or ensure the new lead is added to the Vercel team.

OAuth App: The login system relies on a GitHub OAuth App. If the original creator's GitHub account is deleted, a new OAuth App must be created in GitHub Developer Settings and the Client ID / Client Secret updated in Vercel Environment Variables.

🚀 Future Improvements
Images: Officers can upload images via the CMS; they are stored in assets/images/uploads.

Formatting: If you want to change how the notes look on the main page, edit the template string inside the loadMeetingNotes() function in notes.html.