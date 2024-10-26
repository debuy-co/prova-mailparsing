import { useState, useEffect } from "react";
import "./App.css"; // Add styles for your app

function App() {
  //	•	emails: Stores the list of fetched emails.
  //  •	selectedEmail: Stores the email that the user clicks on from the list.
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch emails from the backend
  useEffect(() => {
    fetch("http://localhost:3001/api/emails")
      .then((response) => response.json())
      .then((data) => setEmails(data))
      .catch((error) => console.error("Error fetching emails:", error));
  }, []);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  //TODO: ok funziona, ma bisogna creare una memoria a lungo termine per salvare tutte le mail altrimenti ad ogni riavvio si cancellano .
  //TODO: da creare un tasto che aggiorna per vedere se ci sono nuove mail, o viene fatto in automatico ogni tot ?
  //TODO: non legge tutte le mail in ingresso

  return (
    <div className="App">
      <header>
        <h1>Email Parser App</h1>
        <p>Total Emails: {emails.length}</p>
      </header>

      <div className="email-list">
        <h2>Email List</h2>
        {emails.length > 0 ? (
          emails.map((email, index) => (
            <div
              key={index}
              className="email-item"
              onClick={() => handleEmailClick(email)}
            >
              <p>
                <strong>From:</strong> {email.from}
              </p>
              <p>
                <strong>Subject:</strong> {email.subject}
              </p>
            </div>
          ))
        ) : (
          <p>No emails found.</p>
        )}
      </div>

      <div className="email-details">
        {selectedEmail ? (
          <div>
            <h2>Email Details</h2>
            <p>
              <strong>From:</strong> {selectedEmail.from}
            </p>
            <p>
              <strong>Subject:</strong> {selectedEmail.subject}
            </p>
            <p>
              <strong>Content:</strong> {selectedEmail.text}
            </p>
            {selectedEmail.attachments &&
              selectedEmail.attachments.length > 0 && (
                <div>
                  <h3>Attachments:</h3>
                  {selectedEmail.attachments.map((att, index) => (
                    <div key={index}>
                      <p>
                        {att.filename} ({att.size} bytes)
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ) : (
          <p>Select an email to see details</p>
        )}
      </div>
    </div>
  );
}

export default App;
