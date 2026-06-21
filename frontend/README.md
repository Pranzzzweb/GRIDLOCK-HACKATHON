# Smart Helmet & Traffic Violation Detection System

## National-Level AI-Powered Road Safety Monitoring Portal

A production-grade React frontend for intelligent vehicle monitoring, helmet detection, and traffic violation tracking using Computer Vision (YOLOv8) and OCR technology.

### 🎯 Features

- **Real-time Image Analysis** - Upload and analyze vehicle images for helmet detection
- **Traffic Violation Detection** - Identify helmet violations, triple riding, and license plate issues
- **Analytics Dashboard** - Comprehensive metrics and visualizations
- **History Management** - Track all analyzed vehicles with search and filtering
- **OCR Integration** - License plate recognition and extraction
- **PDF Reports** - Generate and download analysis reports
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Accessibility** - Full WCAG compliance with semantic HTML and ARIA labels

### 📋 Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **React Icons** - Icon library
- **CSS Modules** - Scoped styling

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Installation

```bash
cd frontend
npm install
```

#### Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Helmet Portal
VITE_APP_VERSION=1.0.0
```

#### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Production Build

```bash
npm run build
npm run preview
```

### 📁 Project Structure

```
src/
├── assets/              # Images, icons, static files
├── components/          # Reusable components
│   ├── common/         # Navbar, Footer, etc.
│   ├── layout/         # Layout wrappers
│   ├── charts/         # Chart components
│   ├── tables/         # Table components
│   ├── forms/          # Form components
│   ├── upload/         # Upload functionality
│   └── results/        # Result display components
├── pages/              # Page components
│   ├── Home/
│   ├── Analyze/
│   ├── Analytics/
│   ├── History/
│   ├── About/
│   ├── Contact/
│   └── NotFound/
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── utils/              # Utility functions
├── styles/             # Global styles
├── context/            # React Context
├── App.jsx
└── main.jsx
```

### 🎨 Design System

#### Color Palette

- **Primary**: `#0F4C81` - Government blue
- **Secondary**: `#1D3557` - Dark blue
- **Accent**: `#2A9D8F` - Teal
- **Background**: `#F5F7FA` - Light gray
- **Success**: `#2E7D32` - Green
- **Warning**: `#ED6C02` - Orange
- **Danger**: `#C62828` - Red

#### Typography

- **Font**: Inter (Google Fonts)
- **Hierarchy**: Government document style
- **Line Height**: 1.5 for readability

### 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Laptop**: 768px - 1024px
- **Desktop**: > 1024px

### ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and descriptions
- Keyboard navigation support
- Focus states on interactive elements
- Alt text on all images
- WCAG 2.1 AA compliant

### 🔧 Configuration

#### Axios Instance

Centralized API configuration in `src/services/api.js` with:
- Base URL from environment variables
- Request/response interceptors
- Error handling
- Automatic timeout management

#### API Endpoints

- `POST /predict` - Analyze image
- `GET /analytics` - Fetch analytics data
- `GET /history` - Fetch history records
- `GET /health` - Health check

### 📊 Analytics Metrics

- Images Processed
- Helmet Detection Rate
- Violations Count
- Average Confidence Score
- Inference Time
- FPS (Frames Per Second)
- Precision, Recall, F1 Score
- mAP50 and mAP50-95

### 📝 Component Documentation

#### Core Components

- **Navbar** - Navigation with theme toggle
- **Footer** - Footer with links and info
- **UploadBox** - Drag & drop file upload
- **Loader** - Loading animations
- **Toast** - Notifications
- **Chart** - Customizable charts
- **MetricCard** - KPI display cards
- **HistoryTable** - Searchable data table

### 🎬 Animations

- Fade in/out transitions
- Slide animations
- Hover effects
- Scale transformations
- Smooth page transitions

### ⚠️ Error Handling

- 404 Page Not Found
- Network error recovery
- Backend offline detection
- Upload failure handling
- Unsupported file type detection
- Empty state displays
- Loading state management

### 🧪 Testing

To be implemented with Vitest and React Testing Library.

### 📦 Build Optimization

- Code splitting by vendor
- Lazy loading routes
- Image optimization
- CSS minification
- JavaScript minification
- Gzip compression

### 🔐 Security

- Environment variable protection
- CORS handling
- XSS prevention
- CSRF protection ready
- Secure headers

### 📞 Support

For issues and questions, please create an issue in the repository.

### 📄 License

Govt. of India - Smart City Mission

---

**Version**: 1.0.0  
**Last Updated**: 2024
