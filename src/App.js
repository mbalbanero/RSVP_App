import React, { useState } from 'react';
import { fetchFamily } from './firebaseService';
import RSVPForm from './RSVPForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';

function App() {
  const [code, setCode] = useState('');
  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await fetchFamily(code.trim().toUpperCase());
      if (!data) {
        setError('Invalid reference code.');
        setFamily(null);
      } else {
        setFamily(data);
      }
    } catch (e) {
      setError('Error fetching RSVP data.');
      setFamily(null);
    }
    setLoading(false);
  };

  const reset = () => {
    setCode('');
    setFamily(null);
    setError('');
  };

  return (
    <div className="container mt-4">
      {!family ? (
        <form onSubmit={handleCodeSubmit}>
          <h2>Enter Reference Code</h2>
          <input
            className="form-control mb-2"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Submit'}
          </button>
          {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
        </form>
      ) : (
        <RSVPForm family={family} code={code} reset={reset} />
      )}
    </div>
  );
}

export default App;
