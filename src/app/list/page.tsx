import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ContactCard from '@/components/ContactCard';
import { Container, Row, Col } from 'react-bootstrap';

export default async function ListContactsPage() {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const contacts = await prisma.contact.findMany({
    where: {
      owner: userEmail ?? '',
    },
  });

  return (
    <Container>
      <h1 className="my-4">List Contacts</h1>
      <Row xs={1} md={3} className="g-4">
        {contacts.map((contact) => (
          <Col key={contact.id}>
            <ContactCard contact={contact} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
