import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  let token = req.header('Authorization');
  token = token && token.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.staffId = decoded.staffId;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;