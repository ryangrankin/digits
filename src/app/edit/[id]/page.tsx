import EditContactForm from '@/components/EditContactForm';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

interface Props {
  params: { id: string };
}

export default async function EditPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  const contact = await prisma.contact.findUnique({
    where: {
      id: Number(params.id),
      owner: session.user.email,
    },
  });

  if (!contact) {
    return <p>Contact not found or you don’t have access.</p>;
  }

  return <EditContactForm contact={contact} />;
}
