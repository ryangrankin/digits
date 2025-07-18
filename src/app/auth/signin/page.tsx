'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/list';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <Container style={{ maxWidth: '400px', marginTop: '2rem' }}>
      <h2 className="mb-4">Sign In</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Sign In
        </Button>
      </Form>
      <p className="mt-3 text-center">
        Don&apos;t have an account?
        {' '}
        <a href="/auth/signup" onClick={(e) => e.preventDefault()}>
          Sign up
        </a>
      </p>
    </Container>
  );
}
