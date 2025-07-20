import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddContactSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  address: Yup.string().required('Address is required'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  description: Yup.string(),
});

export const EditContactSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  address: Yup.string().required('Address is required'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  description: Yup.string().required('Description is required'),
  owner: Yup.string().required('Owner is required'),
});

export const AddNoteSchema = Yup.object({
  note: Yup.string().required(),
  contactId: Yup.number().required(),
  owner: Yup.string().required(),
});