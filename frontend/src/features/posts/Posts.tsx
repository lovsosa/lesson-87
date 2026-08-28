import { useEffect } from 'react';
import { Badge, Card, Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getPosts } from './postsThunks';
import { fetchLoading, posts } from './postsSlice';
import { BASE_URL } from '../../constants';

const Posts = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(posts);
  const loading = useAppSelector(fetchLoading);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

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
              </div>

              <Card.Subtitle className="text-muted small mb-2">
                {post.user?.username ?? 'Аноним'}
                {post.createdAt &&
                  ` · ${dayjs(post.createdAt).format('DD.MM.YYYY HH:mm')}`}
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
