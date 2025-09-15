# MDP Performance Dashboard

A comprehensive performance analytics dashboard for Sam's Club Management Development Program (MDP) evaluations.

## 🚀 Live Application Features

- **📊 Real-time Performance Dashboard**: Interactive analytics with charts and KPIs
- **📝 Function-Specific Survey Forms**: Tailored evaluation questions for each MDP function
- **⚙️ Admin Panel**: Data management, export capabilities, and system statistics
- **📱 Mobile Responsive Design**: Works seamlessly on all devices
- **🔄 Auto-refresh**: Live data updates every 5 minutes
- **📈 Advanced Analytics**: Weighted scoring, performance trends, and comparative analysis

## 🎯 Assessment Framework

### Core Performance Areas (Weighted Scoring)
1. **Job Knowledge** (50% weight) - Technical competence and business acumen
2. **Quality of Work** (20% weight) - Accuracy and attention to detail
3. **Communication Skills & Teamwork** (15% weight) - Collaboration and interpersonal skills
4. **Initiative & Productivity** (15% weight) - Proactive approach and efficiency

### Function-Specific Evaluations
- **Planning**: P&L Management, Retail Math & Analytics
- **Digital Merch**: HAVE+FIND+LOVE+BUY Framework, SEO & Omnichannel Strategy
- **Replenishment**: Demand Forecasting, Inventory Management & Optimization
- **Member's Mark**: Brand Strategy & Positioning, Brand Guidelines & Standards

## 🏗️ Technical Architecture

### Frontend
- **HTML5/CSS3**: Modern, responsive design with Sam's Club branding
- **Vanilla JavaScript**: No framework dependencies for maximum performance
- **Chart.js**: Interactive data visualizations and performance charts
- **Mobile-First Design**: Optimized for all screen sizes

### Backend
- **Node.js**: High-performance JavaScript runtime
- **Express.js**: Fast, unopinionated web framework
- **JSON File Storage**: Simple, reliable data persistence (easily upgradeable)
- **RESTful API**: Clean endpoints for all data operations

### Security & Performance
- **Helmet.js**: Security headers and XSS protection
- **CORS**: Cross-origin resource sharing controls
- **Compression**: Gzip compression for faster loading
- **Input Validation**: Server-side validation for all form submissions

## 📁 Project Structure

```
mdp-dashboard-deploy/
├── 📄 server.js              # Main Node.js server application
├── 📋 package.json           # Dependencies and npm scripts
├── 🌐 index.html             # Survey form (main landing page)
├── 📊 dashboard.html         # Performance analytics dashboard
├── ⚙️ admin.html             # Administrative panel
├── ✅ success.html           # Form submission confirmation
├── 🎨 dashboard.js           # Dashboard JavaScript logic
├── 📝 survey.js              # Survey form interactions
├── 🖼️ SC_Logo_Symbol_RGB_WHT.png # Sam's Club official logo
├── 📚 README.md              # This documentation
├── 🚫 .gitignore             # Git ignore rules
└── 📁 data/
    └── .gitkeep              # Preserves data directory structure
```

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial MDP Dashboard deployment"
   git remote add origin https://github.com/your-org/mdp-dashboard.git
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Visit [railway.app](https://railway.app)
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway automatically detects Node.js and deploys

3. **Access Your Live Application**
   - Survey Form: `https://your-app-name.railway.app/`
   - Dashboard: `https://your-app-name.railway.app/dashboard.html`
   - Admin Panel: `https://your-app-name.railway.app/admin.html`

### Option 2: Manual Server Deployment
```bash
# Install dependencies
npm install

# Start the application
npm start

# Application runs on http://localhost:3001
```

### Option 3: Other Cloud Platforms
- **Vercel**: Supports Node.js applications
- **Render**: Free tier available for Node.js apps
- **Heroku**: Classic platform-as-a-service option

## 🔧 Configuration

### Environment Variables (Optional)
No environment variables required for basic functionality. For advanced features:

```bash
# Email notifications (future enhancement)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Database connection (when upgrading from JSON storage)
DATABASE_URL=postgresql://user:password@host:port/database
```

### Port Configuration
```javascript
const PORT = process.env.PORT || 3001;
```

## 📊 API Endpoints

### Survey Data
- `GET /api/survey-responses` - Retrieve all survey responses
- `POST /api/survey-responses` - Submit new evaluation
- `DELETE /api/survey-responses/:id` - Delete specific response (admin)

### Statistics
- `GET /api/survey-stats` - Get system statistics
- `GET /health` - Health check endpoint

### Example API Response
```json
{
  "id": "mdp_1694773200_abc123",
  "mdpName": "John Smith",
  "function": "Planning",
  "managerName": "Jane Doe",
  "rotation": "3",
  "jobKnowledge": 4,
  "qualityOfWork": 5,
  "communication": 4,
  "initiative": 3,
  "compositeScore": 4.05,
  "timestamp": "2024-09-15T10:30:00.000Z"
}
```

## 📈 Dashboard Features

### Performance Analytics
- **Cohort Overview**: Aggregate performance across all MDPs
- **Individual Analysis**: Detailed view of specific MDP performance
- **Comparative Analysis**: Side-by-side MDP comparisons
- **Function Breakdown**: Performance by MDP function area
- **Manager Insights**: Evaluation patterns by manager

### Filtering & Search
- Filter by function, manager, rotation
- Real-time search across MDP names
- Dynamic summary updates
- Exportable filtered results

### Data Visualization
- **Bar Charts**: Assessment area performance
- **Doughnut Charts**: Function distribution
- **KPI Tiles**: Key performance indicators
- **Data Tables**: Detailed performance breakdown

## 🔒 Security Features

### Data Protection
- **Input Sanitization**: All form inputs validated and sanitized
- **XSS Prevention**: Content Security Policy headers
- **Rate Limiting**: Built-in Express rate limiting
- **CORS Protection**: Configurable cross-origin policies

### Privacy Considerations
- Manager names stored but displayed discretely
- No personally identifiable information beyond MDP names
- Data export controls for admin users only
- Audit trail for all data modifications

## 📱 Mobile Compatibility

### Responsive Design
- **Mobile-First**: Optimized for small screens
- **Touch-Friendly**: Large tap targets and intuitive navigation
- **Fast Loading**: Optimized assets and compression
- **Offline Resilience**: Graceful handling of network issues

### Supported Devices
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Tablets (iPad, Android tablets)
- ✅ Smartphones (iPhone, Android phones)
- ✅ All modern browsers (last 2 versions)

## 🎨 Sam's Club Branding

### Design System
- **Color Palette**: Official Sam's Club colors throughout
- **Typography**: Professional, accessible font choices
- **Logo**: High-resolution Sam's Club logo in headers/footers
- **Consistent UI**: Unified design language across all pages

### Brand Colors
```css
--primary: #0062AD     /* Sam's Club Primary Blue */
--secondary: #00358E   /* Sam's Club Secondary Blue */
--tertiary: #11224B    /* Sam's Club Dark Blue */
--accent1: #35C4EC     /* Sam's Club Light Blue */
```

## 📊 Performance Metrics

### System Monitoring
- Total evaluations submitted
- Unique MDPs evaluated
- Manager participation rates
- Function representation
- Average response completion time

### Analytics Insights
- Performance trends over time
- Function-specific performance patterns
- Manager evaluation consistency
- Rotation progression tracking
- Composite score distributions

## 🔄 Data Management

### Backup & Recovery
- **Automatic Timestamping**: All submissions timestamped
- **Data Versioning**: Metadata tracking for all changes
- **Export Capabilities**: CSV and JSON export options
- **Audit Trail**: Complete history of data modifications

### Scaling Considerations
- **Current**: JSON file storage (perfect for 50-500 evaluations)
- **Future**: Easy migration to PostgreSQL or MongoDB
- **Performance**: Optimized for up to 1000 concurrent users
- **Storage**: Minimal server storage requirements

## 🚀 Getting Started

### For Managers (Survey Submission)
1. Navigate to the main application URL
2. Select your MDP's function from the dropdown
3. Complete all required evaluation fields
4. Submit the evaluation for immediate dashboard inclusion

### For Leadership (Dashboard Viewing)
1. Access the dashboard at `/dashboard.html`
2. Use filters to analyze specific cohorts or functions
3. Export data for further analysis as needed
4. Monitor real-time performance trends

### For Administrators
1. Access the admin panel at `/admin.html`
2. View system statistics and data health
3. Export comprehensive datasets
4. Manage inappropriate or duplicate submissions

## 🛠️ Troubleshooting

### Common Issues
1. **Dashboard not loading data**
   - Check internet connection
   - Verify API endpoints are accessible
   - Clear browser cache and reload

2. **Form submission errors**
   - Ensure all required fields are completed
   - Verify function-specific questions are answered
   - Check browser console for error messages

3. **Charts not displaying**
   - Confirm Chart.js CDN is accessible
   - Check for JavaScript errors in console
   - Verify browser compatibility

### Technical Support
- Check server logs for error messages
- Verify all npm dependencies are installed
- Ensure Node.js version compatibility (≥14.0.0)
- Contact your IT administrator for deployment issues

## 📞 Support & Maintenance

### Monitoring
- Health check endpoint: `/health`
- Server logs include detailed error information
- Performance metrics tracked automatically

### Updates
- Regular security updates for dependencies
- Feature enhancements based on user feedback
- Performance optimizations as usage scales

## 📄 License

Internal use for Sam's Club People Operations only. All rights reserved.

---

## 🎯 Quick Start Summary

1. **Upload to GitHub**: Create repository with all files
2. **Deploy to Railway**: Connect GitHub repo and deploy
3. **Share URLs**: Distribute links to managers and leadership
4. **Monitor Usage**: Use admin panel to track adoption and performance

**Your MDP Performance Dashboard is ready for immediate deployment and use!** 🚀

---

*Built with ❤️ for Sam's Club People Operations Strategy & Transformation*
