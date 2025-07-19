import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Contact, Note } from '@prisma/client';
import NoteItem from './NoteItem';

interface ContactCardProps {
  contact: Contact;
  notes: Note[];
}

export default function ContactCard({ contact, notes }: ContactCardProps) {
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

        <ListGroup variant="flush">
          {notes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </ListGroup>

        {/* Edit link/button here */}
      </Card.Body>
    </Card>
  );
}
