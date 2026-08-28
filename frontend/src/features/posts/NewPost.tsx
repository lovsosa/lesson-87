import { Container } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import type { PostMutation } from '../../interfaces';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { createLoading } from './postsSlice';
import { createPost } from './postsThunks';
import PostForm from './ui/PostForm';

const NewPost = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(createLoading);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (post: PostMutation) => {
    const result = await dispatch(createPost(post));
    if (createPost.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="h4 mb-3">Новый пост</h1>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </Container>
  );
};

export default NewPost;
