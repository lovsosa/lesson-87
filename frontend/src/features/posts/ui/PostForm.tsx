import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import type { PostMutation } from '../../../interfaces';

interface Props {
  onSubmit: (post: PostMutation) => void;
  loading?: boolean;
}

interface FormState {
  title: string;
  description: string;
  image: File | null;
}

interface Errors {
  title?: string;
  description?: string;
  image?: string;
}

const PostForm = ({ onSubmit, loading }: Props) => {
  const [state, setState] = useState<FormState>({
    title: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState<Errors>({});

  const inputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, image: e.target.files?.[0] ?? null }));
  };

  const validate = (): boolean => {
    const next: Errors = {};

    if (!state.title.trim()) {
      next.title = 'Введите заголовок';
    }

    if (!state.description.trim() && !state.image) {
      next.description = 'Заполните описание или прикрепите изображение';
      next.image = 'Прикрепите изображение или заполните описание';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      title: state.title.trim(),
      description: state.description.trim() || undefined,
      image: state.image,
    });
  };

  return (
    <Form onSubmit={submit} noValidate>
      <Form.Group className="mb-3" controlId="post-title">
        <Form.Label>Заголовок</Form.Label>
        <Form.Control
          name="title"
          value={state.title}
          onChange={inputChange}
          isInvalid={Boolean(errors.title)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="post-description">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={state.description}
          onChange={inputChange}
          isInvalid={Boolean(errors.description)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="post-image">
        <Form.Label>Изображение</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={fileChange}
          isInvalid={Boolean(errors.image)}
        />
        <Form.Control.Feedback type="invalid">
          {errors.image}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading && <Spinner as="span" size="sm" className="me-2" />}
        Опубликовать
      </Button>
    </Form>
  );
};

export default PostForm;
