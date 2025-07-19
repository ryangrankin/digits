'use client';

import { ListGroup } from 'react-bootstrap';

interface Note {
  id: string;
  note: string;
  createdAt: string | Date;
}

const NoteItem = ({ note }: { note: Note }) => {
  const created = new Date(note.createdAt).toLocaleDateString('en-US');

  return (
    <ListGroup.Item>
      <p className="fw-lighter">{created}</p>
      <p>{note.note}</p>
    </ListGroup.Item>
  );
};

export default NoteItem;
