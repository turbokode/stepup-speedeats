import jwt from 'jsonwebtoken';

interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string | null;
}

export function generateToken({ id }: UserProps) {
  const token = jwt.sign({ id }, 'secret', { expiresIn: '3d' });
  return token;
}
