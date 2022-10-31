import express from 'express';
import path from 'path'
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') { // for dev mode only
  app.use(morgan('dev'))
}

app.use(express.json()) /// allows us to accept JSON data

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

//paypal
app.get('/api/config/paystack', (req, res) =>
  res.send(process.env.PAYSTACK_KEY)
)

//paystack
/* app.get('api/config/paystack', (req, res) =>
  res.send(process.env.PAYSTACK_KEY)
) */
// Make upload folder static
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Error Handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))