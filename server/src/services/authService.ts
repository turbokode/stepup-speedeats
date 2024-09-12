import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils/env';

interface UserProps {
  id: string;
  restaurant:
    | {
        id: string;
      }[]
    | undefined;
}
export function generateToken(user: UserProps) {
  const token = jwt.sign(
    { id: user.id, restaurantId: user.restaurant && user.restaurant.length ? user.restaurant[0]?.id : undefined },
    APP_SECRET,
    { expiresIn: '3d' }
  );
  return token;
}
