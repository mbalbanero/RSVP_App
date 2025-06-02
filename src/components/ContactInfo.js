import React from 'react';
import { Form } from 'react-bootstrap';

export default function ContactInfo({ contact, updateContact }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateContact({ ...contact, [name]: value });
  };

  return (
    <Form className="mb-3">
      <h5>Contact Details</h5>
      <Form.Group className="mb-2" controlId="contactEmail">
        <Form.Label>Email *</Form.Label>
        <Form.Control
          type="email"
          name="email"
          required
          value={contact.email}
          onChange={handleChange}
          placeholder="Enter email"
        />
      </Form.Group>
      <Form.Group controlId="contactPhone">
        <Form.Label>Mobile Number *</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          required
          value={contact.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />
      </Form.Group>
    </Form>
  );
}