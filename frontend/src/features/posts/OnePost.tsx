import { useEffect } from 'react';
import { Alert, Badge, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BASE_URL } from '../../constants';
import { fetchOnePost } from './postsThunks';
import { onePost, onePostLoading } from './postsSlice';

const OnePost = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const post = useAppSelector(onePost);
  const loading = useAppSelector(onePostLoading);

  useEffect(() => {
    dispatch(fetchOnePost(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!post) {
    return (
      <Container className="py-4" style={{ maxWidth: 640 }}>
        <Alert variant="danger">Пост не найден</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <Card>
        {post.image && (
          <Card.Img
            variant="top"
            src={`${BASE_URL}/images/${post.image}`}
            alt={post.title}
          />
        )}
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>

          <Card.Subtitle className="text-muted small mb-3">
            {post.user?.username ?? 'Аноним'}
            {post.createdAt &&
              ` · ${dayjs(post.createdAt).format('DD.MM.YYYY HH:mm')}`}
            {!post.image && (
              <Badge bg="secondary" className="ms-2">
                текст
              </Badge>
            )}
          </Card.Subtitle>

          {post.description && (
            <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
              {post.description}
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OnePost;
