import { useEffect } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';
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
                <Card.Title className="mb-1">{post.title}</Card.Title>
              </div>

              {post.createdAt && (
                <Card.Subtitle className="text-muted small mb-2">
                  {new Date(post.createdAt).toLocaleString()}
                </Card.Subtitle>
              )}

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
