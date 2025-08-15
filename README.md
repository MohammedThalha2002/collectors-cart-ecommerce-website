# 🛒 CollectorsCart - Rare Collections E-commerce Platform

A premium e-commerce platform specialized in rare collectibles, coins, and vintage items. Built with modern web technologies to provide a seamless shopping experience for collectors and enthusiasts. Also added ci|cd using Github actions.

![CollectorsCart Banner](https://collectorscart.com)

## 🌟 Features

### Customer Experience

- **Premium Product Catalog** - Browse rare collectibles with detailed descriptions and high-quality images
- **Advanced Search & Filtering** - Find specific items by category, price, rarity, and more
- **Wishlist Management** - Save favorite items for later
- **Secure Shopping Cart** - Add items with quantity selection and special birthday notes
- **Order Tracking** - Real-time order status updates with tracking numbers
- **User Authentication** - Secure registration and login system
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Premium UI/UX** - Modern gradient designs with hover effects and animations

### Business Management

- **Admin Dashboard** - Comprehensive management interface
- **Product Management** - Add, edit, and organize collectibles
- **Order Processing** - Handle orders from placement to delivery
- **User Management** - Customer account administration
- **Analytics & Reporting** - Sales insights and performance metrics
- **Inventory Management** - Stock tracking and notifications
- **Invoice Generation** - Automated PDF invoice creation

### Technical Features

- **RESTful API** - Clean and scalable backend architecture
- **Image Management** - Optimized image storage and delivery
- **Email Notifications** - Automated order confirmations and updates
- **Security** - JWT authentication and data validation
- **Caching** - Redis integration for improved performance
- **Database** - MySQL with Sequelize ORM

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Elegant notifications
- **GSAP** - High-performance animations
- **Swiper** - Modern slider component

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MySQL** - Relational database
- **Sequelize** - ORM for database operations
- **Redis** - Caching and session storage
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Nodemailer** - Email service integration
- **Winston** - Logging framework

### Admin Panel

- **React** - Admin interface
- **DaisyUI** - Tailwind CSS components
- **FontAwesome** - Icon library
- **React Pagination** - Data pagination

## 📁 Project Structure

```
collectorscart/
├── client/                 # Customer-facing React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Redux store and custom hooks
│   │   ├── services/      # API integration services
│   │   └── static/        # Static data and constants
│   └── public/            # Public assets
├── backend/               # Node.js API server
│   ├── controller/        # Route handlers
│   ├── model/            # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── template/         # Email and PDF templates
├── admin/                # Admin dashboard
│   └── src/              # Admin React components
└── mailer/               # Email service microservice
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Redis server
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/MohammedThalha2002/rare-collections-ecommerce-website.git
   cd collectorscart
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Install Admin Dependencies**

   ```bash
   cd ../admin
   npm install
   ```

5. **Environment Configuration**

   Create `.env` files in the backend directory:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=collectorscart_db

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # File Upload Path
   UPLOAD_PATH=./Uploads/

   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

   Create `.env` file in the client directory:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_IMAGE_URL=http://localhost:5000/uploads/
   ```

6. **Database Setup**

   ````bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE collectorscart_db;

   # The tables will be created automatically when you start the backend
   ```7. **Start Redis Server**
   ```bash
   redis-server
   ````

### Running the Application

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Server will run on `http://localhost:5000`

2. **Start the Frontend Application**

   ```bash
   cd client
   npm run dev
   ```

   Application will run on `http://localhost:3000`

3. **Start the Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on `http://localhost:3001`

## 📱 Mobile Responsive Design

The application is fully optimized for mobile devices with:

- Touch-friendly interfaces
- Responsive layouts that adapt to screen sizes
- Mobile-optimized navigation and product browsing
- Optimized image loading and caching
- Smooth animations and transitions

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin resource sharing configuration
- **Password Hashing** - Bcrypt encryption for user passwords
- **File Upload Security** - Secure file handling with type validation

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Product Endpoints

- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get single product details
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search` - Search products

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders/user` - Get user orders
- `PUT /api/orders/:id/status` - Update order status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mohammed Thalha**

- GitHub: [@MohammedThalha2002](https://github.com/MohammedThalha2002)
- Website: [collectorscart.com](https://collectorscart.com)

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this platform
- Special thanks to the React and Node.js communities
- Icons by FontAwesome
- UI components inspired by modern e-commerce platforms

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Email: support@collectorscart.com
- Website: [collectorscart.com](https://collectorscart.com)

---

⭐ If you found this project helpful, please give it a star on GitHub!
