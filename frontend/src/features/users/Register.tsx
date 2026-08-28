import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { RegisterMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';
import { register } from './usersThunks';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);

  const [state, setState] = useState<RegisterMutation>({
    username: '',
    password: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const fieldError = (field: string) => {
    try {
      return error?.errors[field].message;
    } catch {
      return undefined;
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register(state));
    if (register.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Регистрация</h1>
      <Form onSubmit={onSubmit} noValidate>
        <Form.Group className="mb-3" controlId="reg-username">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            name="username"
            value={state.username}
            onChange={onChange}
            isInvalid={Boolean(fieldError('username'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('username')}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            onChange={onChange}
            isInvalid={Boolean(fieldError('password'))}
          />
          <Form.Control.Feedback type="invalid">
            {fieldError('password')}
          </Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Spinner as="span" size="sm" className="me-2" />}
          Зарегистрироваться
        </Button>
      </Form>

    </Container>
  );
};

export default Register;
