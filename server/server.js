const express = require("express");
const Imap = require("imap");
const { simpleParser } = require("mailparser");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow cross-origin requests from React

// IMAP configuration to connect to Apple Mail (or other email providers)
const imapConfig = {
  user: "marco.demarco123@yandex.com",
  password: "iqscjqorsrhgltka",
  host: "imap.yandex.com",
  port: 993, // IMAP port
  tls: true, // Secure connection
};

// Function to fetch emails from the inbox
function fetchEmails() {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);

    imap.once("ready", () => {
      imap.openBox("INBOX", false, (err, box) => {
        if (err) return reject(err);

        // Search for unread emails
        imap.search(["UNSEEN"], (err, results) => {
          if (err || !results.length) {
            imap.end();
            return resolve([]);
          }

          const fetchedEmails = [];
          const fetch = imap.fetch(results, { bodies: "", struct: true });

          fetch.on("message", (msg, seqno) => {
            msg.on("body", (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) return reject(err);

                fetchedEmails.push({
                  subject: parsed.subject,
                  from: parsed.from.text,
                  text: parsed.text,
                  attachments: parsed.attachments.map((att) => ({
                    filename: att.filename,
                    content: att.content.toString("base64"),
                    size: att.size,
                  })),
                });
              });
            });
          });

          fetch.once("end", () => {
            imap.end();
            resolve(fetchedEmails);
          });
        });
      });
    });

    imap.once("error", (err) => reject(err));
    imap.connect();
  });
}

// API endpoint to send fetched emails to the frontend
app.get("/api/emails", async (req, res) => {
  try {
    const emails = await fetchEmails();
    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Error fetching emails");
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
