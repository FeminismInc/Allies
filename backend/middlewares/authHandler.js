const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
      return next(); // User is authenticated, proceed to the next middleware or route
    }
    return res.status(401).json({ message: 'Unauthorized' }); // User not authenticated
  };
  
  module.exports = { isAuthenticated };
  