import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import { logout } from '../../features/users/usersThunks';

const AppNavbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Форум
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-md-center gap-2">
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/posts/new">
                  Новый пост
                </Nav.Link>
                <Navbar.Text>
                  Привет, <strong>{user.username}</strong>
                </Navbar.Text>
                <Button
                  size="sm"
                  variant="outline-light"
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Регистрация
                </Nav.Link>
                <Nav.Link as={NavLink} to="/login">
                  Вход
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
