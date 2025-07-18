'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { addContact } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddContactSchema } from '@/lib/validationSchemas';

type ContactFormData = {
  firstName: string;
  lastName: string;
  address: string;
  image: string;
  description?: string;
};

const AddContactForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(AddContactSchema),
  });

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') {
    // redirect or show a message here as needed
    return <p>Please sign in to add a contact.</p>;
  }

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    try {
      await addContact({
        ...data,
        description: data.description || '',
        owner: currentUser,
      });
      swal('Success', 'Your contact has been added', 'success', { timer: 2000 });
      reset();
    } catch (error) {
      swal('Error', 'Failed to add contact', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center">
            <h2>Add Contact</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('firstName')}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('lastName')}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('address')}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    {...register('image')}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('description')}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" className="me-2">
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="warning"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddContactForm;
