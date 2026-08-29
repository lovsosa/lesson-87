import { useEffect } from 'react';
import { Badge, Button, Card, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import { deletePost, getPosts } from './postsThunks';
import { deleteLoading, fetchLoading, posts } from './postsSlice';
import { BASE_URL } from '../../constants';

const Posts = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(posts);
  const loading = useAppSelector(fetchLoading);
  const user = useAppSelector(selectUser);
  const removing = useAppSelector(deleteLoading);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить пост?')) return;
    const result = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(result)) {
      dispatch(getPosts());
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="h4 mb-3">Обсуждения</h1>

      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-muted">Нету обсуждений</p>
      )}

      <div className="d-flex flex-column gap-3">
        {items.map((post) => (
          <Card key={post._id}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-2">
                <Card.Title className="mb-1">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </Card.Title>
                {user && post.user?._id === user._id && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(post._id)}
                    disabled={removing === post._id}
                  >
                    Удалить
                  </Button>
                )}
              </div>

              <Card.Subtitle className="text-muted small mb-2">
                {post.user?.username ?? 'Аноним'}
                {post.createdAt &&
                  ` · ${dayjs(post.createdAt).format('DD.MM.YYYY HH:mm')}`}
                {` · комментарии: ${post.commentsCount ?? 0}`}
                {!post.image && (
                  <Badge bg="secondary" className="ms-2">
                    текст
                  </Badge>
                )}
              </Card.Subtitle>

              {post.image && (
                <img
                  src={`${BASE_URL}/images/${post.image}`}
                  alt={post.title}
                  className="img-fluid rounded my-2"
                />
              )}

              {post.description && (
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                  {post.description}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Posts;
