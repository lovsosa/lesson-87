import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import type { LoginMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLoginError, selectLoginLoading } from './usersSlice';
import { login } from './usersThunks';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);

  const [state, setState] = useState<LoginMutation>({
    username: '',
    password: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(state));
    if (login.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 420 }}>
      <h1 className="h4 mb-3">Вход</h1>

      {error && <Alert variant="danger">{error.error}</Alert>}

      <Form onSubmit={onSubmit} noValidate>
        <Form.Group className="mb-3" controlId="login-username">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            name="username"
            value={state.username}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="login-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={state.password}
            onChange={onChange}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading && <Spinner as="span" size="sm" className="me-2" />}
          Войти
        </Button>
      </Form>

    </Container>
  );
};

export default Login;
