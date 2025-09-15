# MDP Performance Dashboard

A comprehensive performance analytics dashboard for Sam's Club Management Development Program (MDP).

## 🚀 Railway Deployment

This folder contains everything needed to deploy the MDP Performance Dashboard to Railway.

### Live Application Features
- **📊 Real-time Dashboard**: Performance analytics with interactive charts
- **📝 Survey Form**: Function-specific evaluation forms
- **⚙️ Admin Panel**: Data management and export capabilities
- **📱 Mobile Responsive**: Works on all devices
- **🔄 Auto-refresh**: Live data updates every 5 minutes

### URLs After Deployment
- **Survey Form**: `https://your-app-name.railway.app/`
- **Dashboard**: `https://your-app-name.railway.app/dashboard.html`
- **Admin Panel**: `https://your-app-name.railway.app/admin.html`
- **API**: `https://your-app-name.railway.app/api/survey-responses`

## 📋 Assessment Areas

### Core Performance (Weighted)
1. **Job Knowledge** (50% weight)
2. **Quality of Work** (20% weight)
3. **Communication Skills & Teamwork** (15% weight)
4. **Initiative & Productivity** (15% weight)

### Function-Specific Questions
- **Planning**: P&L Management, Retail Math & Analytics
- **Digital Merch**: HAVE+FIND+LOVE+BUY Framework, SEO & Omnichannel
- **Replenishment**: Demand Forecasting, Inventory Management
- **Member's Mark**: Brand Strategy, Guidelines & Standards

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Charts**: Chart.js
- **Storage**: JSON file system (easily upgradeable)
- **Security**: Helmet.js, CORS, Input validation
- **Performance**: Compression, Static file caching

## 📁 File Structure

```
mdp-dashboard-deploy/
├── server.js              # Main server application
├── package.json           # Dependencies and scripts
├── index.html             # Survey form
├── dashboard.html         # Performance dashboard
├── admin.html             # Admin panel
├── success.html           # Form submission success
├── dashboard.js           # Dashboard JavaScript
├── survey.js              # Survey form JavaScript
├── admin.js               # Admin panel JavaScript
├── SC_Logo_Symbol_RGB_WHT.png  # Sam's Club logo
├── data/                  # Data storage directory
│   └── .gitkeep          # Keeps directory in git
└── README.md             # This file
```

## 🚀 Deployment Instructions

### Option 1: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Select "Deploy from GitHub repo"
4. Choose this repository
5. Railway will automatically detect Node.js and deploy

### Option 2: Manual Upload
1. Zip this entire folder
2. Upload to your hosting provider
3. Install dependencies: `npm install`
4. Start the server: `npm start`

## 🔧 Environment Variables (Optional)

No environment variables required for basic functionality. The application will work immediately after deployment.

For email notifications (future feature):
- `EMAIL_USER`: Gmail address for notifications
- `EMAIL_PASS`: Gmail app password

## 📊 Data Storage

The application uses a JSON file system for data storage:
- **Location**: `data/survey-responses.json`
- **Format**: Structured JSON with metadata
- **Backup**: Automatic timestamping and versioning
- **Scalability**: Easily upgradeable to PostgreSQL or MongoDB

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin protection
- **Input Validation**: Required field validation
- **Rate Limiting**: Built-in Express protection
- **Content Security Policy**: XSS protection

## 📈 Analytics & Reporting

### Dashboard Features
- **Cohort View**: Overall performance analytics
- **Individual View**: Single MDP performance
- **Comparison Mode**: Side-by-side MDP comparison
- **Filtering**: By function, manager, rotation
- **Search**: Real-time MDP search
- **Export**: CSV and PDF export capabilities

### Key Performance Indicators
- Total MDPs evaluated
- Average composite scores
- Top performer identification
- Function performance breakdown
- Manager effectiveness metrics
- Rotation progress tracking

## 🎨 Sam's Club Branding

The application features complete Sam's Club branding:
- **Colors**: Official Sam's Club color palette
- **Logo**: High-resolution white logo for headers
- **Typography**: Professional sans-serif fonts
- **Layout**: Clean, corporate design

## 🔄 Auto-refresh & Real-time Updates

- Dashboard auto-refreshes every 5 minutes
- Manual refresh button available
- Real-time data synchronization
- Live status indicators

## 👥 User Roles

### Managers (Survey Submitters)
- Submit performance evaluations
- Function-specific question sets
- Required field validation
- Success confirmation

### Leadership (Dashboard Viewers)
- View performance analytics
- Filter and search data
- Export reports (CSV/PDF)
- Compare MDP performance

### Administrators
- Access all submitted data
- Delete inappropriate responses
- Monitor system health
- Export full datasets

## 📱 Mobile Compatibility

Fully responsive design works on:
- Desktop computers
- Tablets (iPad, Android)
- Smartphones (iPhone, Android)
- All modern browsers

## 🆘 Support & Troubleshooting

### Common Issues
1. **Data not loading**: Check internet connection and API endpoints
2. **Charts not displaying**: Ensure Chart.js CDN is accessible
3. **Form not submitting**: Verify all required fields are completed
4. **Mobile layout issues**: Clear browser cache and reload

### Technical Support
Contact your IT administrator or the People Operations team for technical assistance.

## 📄 License

MIT License - Internal use for Sam's Club only.

## 🏆 Performance Metrics

The dashboard tracks these key metrics:
- Response completion rates
- Average assessment scores
- Function performance trends
- Manager evaluation consistency
- Rotation progression analytics

---

**Ready for Railway Deployment** ✅

This package contains everything needed for immediate deployment to Railway or any Node.js hosting platform.