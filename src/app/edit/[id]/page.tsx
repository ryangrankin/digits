import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { Card, Container } from 'react-bootstrap';
import AddNoteForm from '@/components/AddNoteForm';

export default async function EditContactPage({ params }: { params: { id: string | string[] } }) {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(session);

  const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: { notes: true }, // 🧠 This is key to showing notes
  });

  if (!contact) return notFound();

  return (
    <Container className="py-3">
      <h1>{contact.firstName} {contact.lastName}</h1>
      <p>{contact.address}</p>
      <img src={contact.image} alt={contact.firstName} width="150" />
      <p>{contact.description}</p>

      <h2 className="mt-4">Notes</h2>
      {contact.notes.map(note => (
        <Card key={note.id} className="mb-2">
          <Card.Body>
            <Card.Text>{note.note}</Card.Text>
            <Card.Footer className="text-muted">{note.owner}</Card.Footer>
          </Card.Body>
        </Card>
      ))}

      <h2 className="mt-4">Add a Note</h2>
      <AddNoteForm contactId={contact.id} />
    </Container>
  );
}
