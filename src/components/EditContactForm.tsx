'use client';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { yupResolver } from '@hookform/resolvers/yup';
import { Contact } from '@prisma/client';
import { EditContactSchema } from '@/lib/validationSchemas';
import { editContact } from '@/lib/dbActions';

type ContactInput = Omit<Contact, 'owner'> & { owner: string };

interface EditContactFormProps {
  contact: ContactInput;
}

const EditContactForm: React.FC<EditContactFormProps> = ({ contact }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: yupResolver(EditContactSchema),
    defaultValues: contact,
  });

  const onSubmit = async (data: ContactInput) => {
    await editContact(data);
    swal('Success', 'Your contact has been updated', 'success', { timer: 2000 });
    reset(data); // reset form with updated data
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center mb-3">
            <h2>Edit Contact</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register('id')} />
                <input type="hidden" {...register('owner')} />

                <Form.Group controlId="firstName" className="mb-3">
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

                <Form.Group controlId="lastName" className="mb-3">
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

                <Form.Group controlId="address" className="mb-3">
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

                <Form.Group controlId="image" className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('image')}
                    isInvalid={!!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.image?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register('description')}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="form-group pt-3">
                  <Row>
                    <Col>
                      <Button type="submit" variant="primary">
                        Update Contact
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        variant="warning"
                        onClick={() => reset()}
                        className="float-right"
                      >
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditContactForm;
