'use client';

import Card from 'react-bootstrap/Card';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description: string;
  owner: string;
}

export default function ContactCardAdmin({ contact }: { contact: Contact }) {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={contact.image}
        alt={`${contact.firstName} ${contact.lastName}`}
        style={{ objectFit: 'cover', height: '200px' }}
      />
      <Card.Body>
        <Card.Title>
          {contact.firstName}
          {' '}
          {contact.lastName}
        </Card.Title>
        <Card.Text>{contact.address}</Card.Text>
        <Card.Text>{contact.description}</Card.Text>
        <p className="blockquote-footer">{contact.owner}</p>
      </Card.Body>
    </Card>
  );
}
