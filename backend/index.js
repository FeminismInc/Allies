
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
const io = new Server(server);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

connectDB();

console.log("HELP");
io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
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

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







