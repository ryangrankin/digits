'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addNote } from '@/lib/dbActions'; // adjust import path
import { AddNoteSchema } from '@/lib/validationSchemas';
import { useFormik } from 'formik';

interface AddNoteFormProps {
  contactId: number;
  owner: string;
}

export default function AddNoteForm({ contactId, owner }: AddNoteFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      note: '',
      contactId,
      owner,
    },
    validationSchema: AddNoteSchema,
    onSubmit: async (values) => {
      try {
        await addNote(values);
        router.refresh(); // refresh the page to show new note
      } catch (err) {
        setError('Failed to add note.');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label htmlFor="note" className="form-label">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          className="form-control"
          rows={3}
          value={formik.values.note}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.note && formik.errors.note ? (
          <div className="text-danger">{formik.errors.note}</div>
        ) : null}
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="contactId" value={contactId} />
      <input type="hidden" name="owner" value={owner} />

      {error && <div className="text-danger mb-2">{error}</div>}

      <button type="submit" className="btn btn-primary">
        Add Note
      </button>
    </form>
  );
}
