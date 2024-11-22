const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ["https://sensible-t-frontend.vercel.app"],
  methods: ["GET", "POST","PUT", "DELETE"],
  credentials:true
}));
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb+srv://chinnasivakrishna2003:siva@cluster0.u7gjmpo.mongodb.net/sensible?retryWrites=true&w=majority&appName=Cluster0', {
  
}).then(() => console.log('Connected to DB'))
  .catch(err => console.log(err));

// Import Routes
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transaction');

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
