# ChemTrack - Chemical Management System

A modern, responsive web application for managing laboratory chemical inventory with advanced search, filtering, and administrative capabilities.

## 🧪 Features

### 🔍 Chemical Inventory Management
- **Search & Filter**: Real-time search by name, formula, or bottle number with location-based filtering
- **Detailed Chemical Information**: View comprehensive chemical data including formulas, synonyms, MSDS links, and 2D structures
- **Visual Formula Display**: Proper chemical formula rendering with subscripts and superscripts
- **Location Tracking**: Track chemicals by shelf location and bottle numbers
- **Multiple View Modes**: Switch between card and table layouts

### 👨‍💼 Administrative Features
- **Admin Dashboard**: Overview of system statistics and quick access to management tools
- **Chemical Management**: Add, edit, and delete chemicals with PubChem integration for automatic data fetching
- **Shelf Management**: Organize chemicals by shelves and locations
- **User Authentication**: Role-based access control with admin-only sections

### 🎨 User Experience
- **Modern UI**: Clean, professional design with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Theme switching support
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast)

### Backend Integration
- **API**: RESTful API hosted on Azure
- **Authentication**: JWT-based authentication
- **External APIs**: PubChem integration for chemical data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashraj221B/chemical-management-frontend.git
   cd chemical-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup** (Optional)
   Create a `.env` file for custom backend URL:
   ```env
   VITE_BACKEND_URL=your-backend-url
   ```
   *Default backend URL: https://chemical-management-backend.azurewebsites.net*

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── ChemicalCard.tsx
│   ├── ChemicalModal.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   └── Navbar.tsx
├── pages/              # Page components
│   ├── chemicals.tsx   # Main chemical inventory page
│   ├── login.tsx       # Authentication page
│   └── admin/          # Admin-only pages
│       ├── Dashboard.tsx
│       ├── ManageChemicals.tsx
│       └── ManageShelves.tsx
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication context
├── lib/                # Utility functions
│   └── utils.ts
└── assets/             # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🔐 Authentication

The application supports role-based authentication:

- **Public Access**: View chemical inventory
- **Admin Access**: Full CRUD operations on chemicals and shelves
- **JWT Tokens**: Secure authentication with automatic token refresh

### Default Admin Credentials
Contact system administrator for admin access credentials.

## 🌐 Deployment

### GitHub Pages
Deploy to GitHub Pages using:
```bash
npm run deploy
```

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## 🔌 API Integration

The frontend communicates with a FastAPI backend that provides:
- Chemical CRUD operations
- Shelf management
- User authentication
- PubChem data integration
- Search and filtering capabilities

## 🎯 Key Features in Detail

### Chemical Search & Filtering
- Real-time search across name, formula, and bottle number
- Location-based filtering by shelf
- Advanced chemical formula rendering

### Admin Dashboard
- System statistics overview
- Quick access to management functions
- Database health monitoring

### PubChem Integration
- Automatic chemical data fetching
- 2D structure image retrieval
- Synonym and alternative name lookup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## 🔮 Future Enhancements

- [ ] Chemical expiry date tracking
- [ ] Barcode scanning support
- [ ] Export functionality (PDF, Excel)
- [ ] Advanced reporting and analytics
- [ ] Integration with laboratory equipment
- [ ] Mobile app development

---

**ChemTrack** - Making chemical inventory management simple and efficient.
