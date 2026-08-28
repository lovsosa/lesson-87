import { useEffect } from 'react';
import { Alert, Badge, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BASE_URL } from '../../constants';
import { selectUser } from '../users/usersSlice';
import { fetchOnePost } from './postsThunks';
import { onePost, onePostLoading } from './postsSlice';
import {
  comments,
  commentCreateLoading,
  commentsLoading,
} from '../comments/commentsSlice';
import { createComment, fetchComments } from '../comments/commentsThunks';
import CommentForm from '../comments/ui/CommentForm';

const OnePost = () => {
  const { id } = useParams() as { id: string };
  const dispatch = useAppDispatch();
  const post = useAppSelector(onePost);
  const loading = useAppSelector(onePostLoading);
  const user = useAppSelector(selectUser);
  const commentItems = useAppSelector(comments);
  const commentsFetching = useAppSelector(commentsLoading);
  const commentSending = useAppSelector(commentCreateLoading);

  useEffect(() => {
    dispatch(fetchOnePost(id));
    dispatch(fetchComments(id));
  }, [dispatch, id]);

  const addComment = async (text: string) => {
    const result = await dispatch(createComment({ post: id, text }));
    if (createComment.fulfilled.match(result)) {
      dispatch(fetchComments(id));
    }
  };

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
      <Card className="mb-4">
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

      <h2 className="h5 mb-3">Комментарии ({commentItems.length})</h2>

      {commentsFetching ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" role="status" />
        </div>
      ) : commentItems.length === 0 ? (
        <p className="text-muted">Комментариев пока нет</p>
      ) : (
        <div className="d-flex flex-column gap-2 mb-4">
          {commentItems.map((comment) => (
            <Card key={comment._id} body>
              <div className="small text-muted mb-1">
                {comment.user?.username ?? 'Аноним'} ·{' '}
                {dayjs(comment.createdAt).format('DD.MM.YYYY HH:mm')}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</div>
            </Card>
          ))}
        </div>
      )}

      {user ? (
        <CommentForm onSubmit={addComment} loading={commentSending} />
      ) : (
        <Alert variant="secondary">
          Войдите, чтобы оставить комментарий.
        </Alert>
      )}
    </Container>
  );
};

export default OnePost;
