import { useState, useEffect } from "react";

function App() {
  const [emails, setEmails] = useState([]);

  // Fetch emails from the backend (Node.js server)
  useEffect(() => {
    fetch("http://localhost:3001/api/emails") //fetch it’s a JavaScript function that makes HTTP requests to our backend to get the emails.
      .then((response) => response.json())
      .then((data) => setEmails(data))
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);

  return (
    <div className="App">
      <h1>Email Parser</h1>
      {emails.length > 0 ? (
        emails.map((email, index) => (
          <div key={index}>
            <h2>{email.subject}</h2>
            <p>From: {email.from}</p>
            <p>{email.text}</p>
            {email.attachments && email.attachments.length > 0 && (
              <div>
                <h3>Attachments:</h3>
                {email.attachments.map((attachment, idx) => (
                  <div key={idx}>
                    <p>
                      {attachment.filename} ({attachment.size} bytes)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No emails available.</p>
      )}
    </div>
  );
}

export default App;
