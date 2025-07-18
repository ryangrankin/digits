/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import { Card } from 'react-bootstrap';

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  description: string;
}

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const { id, firstName, lastName, image, description } = contact;

  return (
    <Card className="h-100">
      <Card.Img variant="top" src={image} alt={`${firstName} ${lastName}`} />
      <Card.Body>
        <Card.Title>
          {firstName}
          {' '}
          {lastName}
        </Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Link href={`/edit/${id}`}>
          <a>Edit</a>
        </Link>
      </Card.Footer>
    </Card>
  );
}
