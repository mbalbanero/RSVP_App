import React, { useState } from 'react';
import ContactInfo from './components/ContactInfo';
import GuestList from './components/GuestList';
import { saveRSVP } from './firebaseService';
import { Button, Spinner, Alert } from 'react-bootstrap';

export default function RSVPForm({ family, code, reset }) {
  const [guests, setGuests] = useState(family.guests || []);
  const [contact, setContact] = useState(family.contact || { email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [contactError, setContactError] = useState('');

  // Autosave function
  const autoSave = async (newGuests, newContact) => {
    setSaving(true);
    try {
      await saveRSVP(code, newGuests, newContact);
    } catch (e) {
      console.error('Auto save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  // Update guests handler with autosave
  const updateGuests = (newGuests) => {
    setGuests(newGuests);
    autoSave(newGuests, contact);
  };

  // Update contact handler with autosave
  const updateContact = (newContact) => {
    setContact(newContact);
    autoSave(guests, newContact);
  };

  // Done button handler: validate required contact fields before saving
  const handleDone = async () => {
    if (!contact.email.trim() || !contact.phone.trim()) {
      setContactError('Email and Mobile Number are required.');
      return;
    }
    setContactError('');
    await autoSave(guests, contact);
    reset();
  };

  return (
    <div>
      <h3>{family.familyName} - RSVP</h3>
      <p>Seats reserved: {family.seats}</p>

      <ContactInfo contact={contact} updateContact={updateContact} />

      <GuestList
        guests={guests}
        updateGuests={updateGuests}
        seatLimit={family.seats}
        contact={contact} 
      />

      {contactError && (
        <Alert variant="danger" onClose={() => setContactError('')} dismissible>
          {contactError}
        </Alert>
      )}

      <Button variant="success" className="mt-2" onClick={handleDone} disabled={saving}>
        {saving ? (
          <>
            <Spinner animation="border" size="sm" /> Saving...
          </>
        ) : (
          'Done'
        )}
      </Button>
    </div>
  );
}
