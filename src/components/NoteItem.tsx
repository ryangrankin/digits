import ListGroup from 'react-bootstrap/ListGroup';

interface Note {
  id: number;
  contactId: number;
  note: string;
  owner: string;
  createdAt: string | Date;
}

interface NoteItemProps {
  note: Note;
}

export default function NoteItem({ note }: NoteItemProps) {
  const createdAt = typeof note.createdAt === 'string' ? new Date(note.createdAt) : note.createdAt;

  return (
    <ListGroup.Item>
      <p className="fw-lighter">{createdAt.toLocaleDateString('en-US')}</p>
      <p>{note.note}</p>
    </ListGroup.Item>
  );
}
