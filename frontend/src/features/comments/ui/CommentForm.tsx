import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';

interface Props {
  onSubmit: (text: string) => void;
  loading?: boolean;
}

const CommentForm = ({ onSubmit, loading }: Props) => {
  const [text, setText] = useState('');

  const change = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <Form onSubmit={submit}>
      <Form.Group className="mb-2" controlId="comment-text">
        <Form.Label>Комментарий</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={change}
        />
      </Form.Group>
      <Button type="submit" variant="primary" disabled={loading || !text.trim()}>
        {loading && <Spinner as="span" size="sm" className="me-2" />}
        Отправить
      </Button>
    </Form>
  );
};

export default CommentForm;
