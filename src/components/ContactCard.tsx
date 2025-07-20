'use client';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Contact } from '@prisma/client';
import Link from 'next/link';
import NoteItem from './NoteItem';

interface Note {
  id: number;
  contactId: number;
  note: string;
  owner: string;
  createdAt: string | Date;
}

interface ContactCardProps {
  contact: Contact;
  notes: Note[];
}

export default function ContactCard({ contact, notes }: ContactCardProps) {
  return (
    <Card className="mb-3">
      <Card.Img variant="top" src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
      <Card.Body>
        <Card.Title>
          {contact.firstName}
          {' '}
          {contact.lastName}
        </Card.Title>
        <Card.Text>{contact.description}</Card.Text>
      </Card.Body>

      <ListGroup variant="flush">
        {notes.map(note => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ListGroup>

      <Card.Footer>
        <Link href={`/edit/${contact.id}`}>Edit</Link>
      </Card.Footer>
    </Card>
  );
}
