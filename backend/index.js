
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const connectSocket = require('./config/socket.js')
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { isAuthenticated } = require('./middlewares/authHandler');
const session = require('express-session');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const uri = "mongodb+srv://kenhun2020:lhOAvQxVo7yJskRE@cluster0.ebktn.mongodb.net/Allies?retryWrites=true&w=majority&appName=Cluster0";

const app = express();

const server = createServer(app);
const io = new Server(server, { cors: {origin: "http://localhost:3000"}}); // 'http://54.176.5.254:3000'

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

connectDB();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for messages from the client
  socket.on('messageOut', async (message) => {
      console.log('Message sent:', message);
      
      // Emit message to all connected clients
      io.emit('messageIn', { ...message }); // Use the incoming message directly
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

const PORT = 5050;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(session({
  secret: 'SuperSecretKeyWeUseShhh',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: uri, 
    ttl: 14 * 24 * 60 * 60, // 14 day expiration
    autoRemove: 'native', 
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day expiration for cookie
  },
}));


app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

app.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({ message: 'You are authorized to access this route!' });
});







