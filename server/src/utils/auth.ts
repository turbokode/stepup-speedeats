import jwt from 'jsonwebtoken';
import { APP_SECRET } from './env';

interface UserProps {
  id: string;
}

export function generateToken({ id }: UserProps) {
  const token = jwt.sign({ id }, APP_SECRET, { expiresIn: '3d' });
  return token;
}
