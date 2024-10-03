
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const messageRoutes = require('./routes/messageRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middlewares/errorHandler');


const app = express();

// NTS: move uri login credentials to config.env file 

app.use(express.json());

app.use(cors());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/comments', commentRoutes);

app.use(errorHandler);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




