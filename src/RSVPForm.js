import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Button, Form, Table, Alert } from 'react-bootstrap';
import { fetchRSVPData, saveRSVPData } from './firebaseService';

function RSVPForm() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [contact, setContact] = useState({ phone: '', email: '' });
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docData = await fetchRSVPData(code);
        if (docData) {
          setData(docData);
          setContact(docData.contact);
          setGuests(docData.guests || []);
        } else {
          setError('Reference code not found');
        }
      } catch (err) {
        setError('Error fetching RSVP data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  const saveData = async (updatedGuests, updatedContact = contact) => {
    try {
      await saveRSVPData(code, updatedGuests, updatedContact);
    } catch (err) {
      console.error('Error saving data:', err);
      setError('Error saving changes');
    }
  };

  const handleContactChange = (field, value) => {
    const updatedContact = { ...contact, [field]: value };
    setContact(updatedContact);
    saveData(guests, updatedContact);
  };

  const handleGuestChange = (index, field, value) => {
    const updatedGuests = [...guests];
    updatedGuests[index][field] = value;
    setGuests(updatedGuests);
    saveData(updatedGuests);
  };

  const addGuest = () => {
    if (guests.length >= data.seats) return;
    const newGuest = { title: '', firstName: '', lastName: '' };
    const updatedGuests = [...guests, newGuest];
    setGuests(updatedGuests);
    saveData(updatedGuests);
  };

  const deleteGuest = (index) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
    saveData(updatedGuests);
  };

  const handleDone = () => {
    navigate('/');
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3>{data.familyName}</h3>
      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={contact.email}
          onChange={(e) => handleContactChange('email', e.target.value)}
          required
          isInvalid={!contact.email}
        />
        <Form.Control.Feedback type="invalid">
          Email is required
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control
          type="text"
          value={contact.phone}
          onChange={(e) => handleContactChange('phone', e.target.value)}
          required
          isInvalid={!contact.phone}
        />
        <Form.Control.Feedback type="invalid">
          Phone number is required
        </Form.Control.Feedback>
      </Form.Group>
      <h5 className="mt-4">Guest List ({guests.length}/{data.seats})</h5>
      <Table bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, idx) => (
            <tr key={idx}>
              <td>
                <Form.Control
                  value={guest.title}
                  onChange={(e) => handleGuestChange(idx, 'title', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  value={guest.firstName}
                  required
                  onChange={(e) => handleGuestChange(idx, 'firstName', e.target.value)}
                  isInvalid={!guest.firstName}
                />
              </td>
              <td>
                <Form.Control
                  value={guest.lastName}
                  required
                  onChange={(e) => handleGuestChange(idx, 'lastName', e.target.value)}
                  isInvalid={!guest.lastName}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => deleteGuest(idx)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addGuest} disabled={guests.length >= data.seats} className="me-2">
        Add Guest
      </Button>
      <Button variant="success" onClick={handleDone}>Done</Button>
    </>
  );
}

export default RSVPForm;
