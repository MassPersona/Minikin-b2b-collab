import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main style={{padding: 24}}>
      <h2>404 — Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </main>
  );
}
