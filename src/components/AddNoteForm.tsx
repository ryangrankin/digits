'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addNote } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddNoteSchema } from '@/lib/validationSchemas';

type NoteFormData = {
  note: string;
  contactId: number;
  owner: string;
};

export default function AddNoteForm({ contactId }: { contactId: number }) {
  const { data: session, status } = useSession();
  const owner = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: yupResolver(AddNoteSchema),
    defaultValues: {
      note: '',
      contactId,
      owner,
    },
  });

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') return <p>Please sign in to add a note.</p>;

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    try {
      await addNote(data);
      swal('Success', 'Note added successfully', 'success', { timer: 2000 });
      reset();
    } catch (error) {
      swal('Error', 'Failed to add note', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h3>Add Note</h3>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('note')}
                    isInvalid={!!errors.note}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.note?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <input type="hidden" {...register('contactId')} />
                <input type="hidden" {...register('owner')} />

                <Button type="submit" variant="primary">
                  Submit Note
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
