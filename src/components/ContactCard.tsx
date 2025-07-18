import Card from 'react-bootstrap/Card';
import { Contact } from '@prisma/client';

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  return (
    <Card>
      <Card.Img variant="top" src={contact.image} alt={`${contact.firstName} ${contact.lastName}`} />
      <Card.Body>
        <Card.Title>
          {contact.firstName}
          {' '}
          {contact.lastName}
        </Card.Title>
        <Card.Text>{contact.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
