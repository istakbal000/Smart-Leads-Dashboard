import User, { IUser, UserRole } from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const registerUser = async (userData: Partial<IUser>) => {
  const { email } = userData;
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error('User already exists');
    (error as any).statusCode = 400;
    throw error;
  }

  const user = await User.create(userData);
  
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken((user._id as any).toString()),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (user && (await user.comparePassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as any).toString()),
    };
  } else {
    const error = new Error('Invalid email or password');
    (error as any).statusCode = 401;
    throw error;
  }
};
