'use client';

import Card from 'react-bootstrap/Card';

export default function ContactCardAdmin({ contact }: { contact: any }) {
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
