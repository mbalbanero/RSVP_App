import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Spinner,
  Button,
  Form,
  Container,
  Alert,
  Navbar,
  Nav,
} from 'react-bootstrap';
import RSVPForm from './RSVPForm';

function App() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [rsvpCode, setRsvpCode] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await RSVPForm.fetchRSVPData(code);
      if (response) {
        setRsvpCode(code);
      } else {
        setError('Reference code not found');
      }
    } catch (e) {
      setError('Error fetching RSVP data');
    }
    setLoading(false);
  };

  const handleDone = () => {
    setRsvpCode(null);
    setCode('');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Wedding RSVP</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleDone}>Home</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {!rsvpCode ? (
          <>
            <h3>Search Your RSVP Code</h3>
            <Form.Control
              type="text"
              placeholder="Enter Reference Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button className="mt-2" onClick={handleSearch} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
            </Button>
            {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
          </>
        ) : (
          <RSVPForm code={rsvpCode} onDone={handleDone} />
        )}
      </Container>
    </>
  );
}

export default App;