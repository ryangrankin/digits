'use client';

import Card from 'react-bootstrap/Card';
import { Contact } from '@prisma/client';

export default function ContactCardAdmin({ contact }: { contact: Contact }) {
  return (
    <Card>
      <Card.Img variant="top" src={contact.image} alt={contact.firstName} />
      <Card.Body>
        <Card.Title>
          {contact.firstName}
          {' '}
          {contact.lastName}
        </Card.Title>
        <Card.Text>{contact.description}</Card.Text>
        <p className="blockquote-footer">{contact.owner}</p>
      </Card.Body>
    </Card>
  );
}
