import React, { useState, useEffect } from 'react';
import ContactInfo from './components/ContactInfo';
import GuestList from './components/GuestList';
import { saveRSVP } from './firebaseService';
import { Button, Spinner } from 'react-bootstrap';

export default function RSVPForm({ family, code, reset }) {
  const [guests, setGuests] = useState(family.guests || []);
  const [contact, setContact] = useState(family.contact || { email: '', phone: '' });
  const [saving, setSaving] = useState(false);

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


  // Done button handler: autosave and reset to search
  const handleDone = async () => {
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
      />


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