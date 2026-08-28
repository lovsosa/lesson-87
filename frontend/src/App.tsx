import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar/AppNavbar';
import NotFound from './components/NotFound/NotFound';
import Posts from './features/posts/Posts';
import OnePost from './features/posts/OnePost';
import NewPost from './features/posts/NewPost';
import Login from './features/users/Login';
import Register from './features/users/Register';

const App = () => {
  return (
    <>
      <AppNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/posts/new" element={<NewPost />} />
          <Route path="/posts/:id" element={<OnePost />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
