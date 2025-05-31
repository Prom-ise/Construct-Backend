import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.email === process.env.ADMIN_EMAIL) {
    return next();
  }

  res.status(403).json({ msg: 'Access denied: Admins only' });
};
