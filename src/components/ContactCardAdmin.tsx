'use client';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Contact } from '@prisma/client';
import NoteItem from './NoteItem';

interface Note {
  id: number;
  contactId: number;
  note: string;
  owner: string;
  createdAt: string | Date;
}

interface ContactCardAdminProps {
  contact: Contact;
  notes: Note[];
}

export default function ContactCardAdmin({ contact, notes }: ContactCardAdminProps) {
  return (
    <Card className="mb-3">
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

      <ListGroup variant="flush">
        {notes.map(note => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ListGroup>
    </Card>
  );
}
