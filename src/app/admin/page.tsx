import { Col, Container, Row } from 'react-bootstrap';
import ContactCardAdmin from '@/components/ContactCardAdmin';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'List Contacts (Admin)',
};

export default async function AdminPage() {
  const contacts = await prisma.contact.findMany();

  return (
    <Container>
      <h1 className="my-4">List Contacts (Admin)</h1>
      {' '}
      {}
      <Row xs={1} md={3} className="g-4">
        {contacts.map((contact) => (
          <Col key={contact.id}>
            <ContactCardAdmin contact={contact} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
