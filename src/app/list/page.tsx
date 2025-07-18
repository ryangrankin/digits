import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ContactCard from '@/components/ContactCard';

export default async function ListContactsPage() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect('/auth/signin');
  }
  const contacts = await prisma.contact.findMany({
    where: { owner: session.user.email },
  });
  return (
    <div className="container py-3">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {contacts.map((contact) => (
          <div className="col" key={contact.id}>
            <ContactCard contact={contact} />
          </div>
        ))}
      </div>
    </div>
  );
}
