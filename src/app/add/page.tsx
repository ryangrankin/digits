import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import AddContactForm from '@/components/AddContactForm';

export default async function AddPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <p>Please log in to add contacts.</p>;
  }

  return (
    <main>
      <AddContactForm owner={session.user.email} />
    </main>
  );
}
