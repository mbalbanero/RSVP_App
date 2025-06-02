// src/GuestList.js
import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';

export default function GuestList({ guests, updateGuests, seatLimit }) {
  const [editIndex, setEditIndex] = useState(null);
  const [localGuest, setLocalGuest] = useState(null);
  const [newGuest, setNewGuest] = useState({
    title: '',
    firstName: '',
    lastName: '',
  });

  const startEdit = (index) => {
    setEditIndex(index);
    setLocalGuest({ ...guests[index] });
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setLocalGuest(null);
  };

  const handleEditChange = (field, value) => {
    setLocalGuest((prev) => ({ ...prev, [field]: value }));
  };

  const handleNewGuestChange = (field, value) => {
    setNewGuest((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = () => {
    if (!localGuest.firstName.trim() || !localGuest.lastName.trim()) {
      alert('First Name and Last Name are required.');
      return;
    }
    const updatedGuests = [...guests];
    updatedGuests[editIndex] = localGuest;
    updateGuests(updatedGuests);
    setEditIndex(null);
    setLocalGuest(null);
  };

  const handleDelete = (index) => {
    if (editIndex === index) cancelEdit();
    const updatedGuests = guests.filter((_, i) => i !== index);
    updateGuests(updatedGuests);
  };

  const addGuest = () => {
    if (guests.length >= seatLimit) {
      alert(`Only ${seatLimit} guest(s) allowed.`);
      return;
    }

    if (!newGuest.firstName.trim() || !newGuest.lastName.trim()) {
      alert('First Name and Last Name are required.');
      return;
    }

    const updatedGuests = [...guests, newGuest];
    updateGuests(updatedGuests);
    setNewGuest({ title: '', firstName: '', lastName: '' });
  };

  return (
    <>
      <h5>
        Guests ({guests.length} / {seatLimit})
      </h5>

      {/* New guest input */}
      <Form className="mb-3">
        <Row className="align-items-center">
          <Col md={2}>
            <Form.Control
              type="text"
              placeholder="Title (optional)"
              value={newGuest.title}
              onChange={(e) => handleNewGuestChange('title', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="First Name *"
              value={newGuest.firstName}
              onChange={(e) => handleNewGuestChange('firstName', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Last Name *"
              value={newGuest.lastName}
              onChange={(e) => handleNewGuestChange('lastName', e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button onClick={addGuest} className="w-100">
              Add Guest
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Guest list */}
      {guests.map((guest, i) => (
        <Form key={i} className="mb-2">
          <Row className="align-items-center">
            <Col md={2}>
              <Form.Control
                type="text"
                placeholder="Title"
                disabled={editIndex !== i}
                value={editIndex === i ? localGuest.title : guest.title}
                onChange={(e) => handleEditChange('title', e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="First Name *"
                disabled={editIndex !== i}
                value={editIndex === i ? localGuest.firstName : guest.firstName}
                onChange={(e) => handleEditChange('firstName', e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Last Name *"
                disabled={editIndex !== i}
                value={editIndex === i ? localGuest.lastName : guest.lastName}
                onChange={(e) => handleEditChange('lastName', e.target.value)}
              />
            </Col>
            <Col md={2} className="d-flex gap-1">
              {editIndex === i ? (
                <>
                  <Button variant="success" onClick={saveEdit} className="flex-grow-1">
                    Update
                  </Button>
                  <Button variant="secondary" onClick={cancelEdit} className="flex-grow-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="warning" onClick={() => startEdit(i)} className="flex-grow-1">
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(i)} className="flex-grow-1">
                    Delete
                  </Button>
                </>
              )}
            </Col>
          </Row>
        </Form>
      ))}
    </>
  );
}
