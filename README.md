
# Domain Sales Frontend

A modern, production-ready Next.js 14 frontend application for managing and selling domain names. Built with TypeScript, Tailwind CSS, and the Next.js App Router.

## 🚀 Features

- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, App Router
- **Responsive Design**: Mobile-first design that works on all devices
- **Domain Listing**: Browse all available domains with search and filtering
- **Featured Domains**: Highlight premium domains
- **Domain Details**: Detailed view with WhatsApp and Afternic integration
- **Admin Dashboard**: Full CRUD interface for managing domains
- **Real-time Search**: Filter domains by name, city, and category
- **Secure Authentication**: Token-based admin authentication with localStorage

## 📋 Prerequisites

- Node.js 18+ or any version that supports ES2017
- npm, yarn, or pnpm package manager
- A running backend API (see Backend Requirements below)

## 🛠️ Installation

1. **Extract the frontend package**

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set your backend API URL:
   ```env
   NEXT_PUBLIC_API_BASE=http://localhost:3001
   NEXT_PUBLIC_ADMIN_HINT="Contact support for admin access"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Backend Requirements

This frontend connects to a backend API. The backend must provide these endpoints:

### Public Endpoints

- `GET /api/domains?isSold=false` - Get all active domains
  - Optional query params: `isSold`, `isFeatured`
  - Response: Array of domain objects

- `GET /api/domain/:slug` - Get single domain by slug/domain name
  - Response: Single domain object

### Admin Endpoints (require `Authorization: Bearer TOKEN`)

- `POST /api/admin/domain` - Create new domain
  - Body: `{ domain_name, price_usd, whatsapp_number, afternic_url, city?, category?, isFeatured? }`

- `PUT /api/admin/domain/:id` - Update domain
  - Body: Partial domain object

- `DELETE /api/admin/domain/:id` - Delete/deactivate domain

### Domain Object Schema

```typescript
{
  id: number;
  domain_name: string;
  price_usd: number;
  price_brl: number;
  whatsapp_number: string;
  afternic_url: string;
  active: boolean;
  city?: string;
  category?: string;
  isFeatured?: boolean;
  created_at?: string;
  updated_at?: string;
}
```

## 📁 Project Structure

```
domain-sales-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Home page with domain listing
│   ├── globals.css          # Global styles
│   ├── admin/
│   │   └── page.tsx         # Admin dashboard
│   └── domains/
│       └── [slug]/
│           └── page.tsx     # Domain detail page
├── components/              # React components
│   ├── ui/                  # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── card.tsx
│   ├── admin/               # Admin-specific components
│   │   ├── domain-form.tsx
│   │   └── domain-list.tsx
│   ├── domain-card.tsx      # Domain card component
│   └── domain-filters.tsx   # Search and filter component
├── lib/                     # Utility functions
│   ├── api.ts               # API client functions
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
│   └── index.ts             # Domain and filter types
├── public/                  # Static assets
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎨 Pages

### Home Page (`/`)

- Lists all active domains (where `isSold=false`)
- Featured domains section (domains with `isFeatured=true`)
- Search by domain name
- Filter by city and category
- Click any domain to view details

### Domain Detail Page (`/domains/[slug]`)

- Complete domain information
- Pricing in both USD and BRL
- **"Falar no WhatsApp"** button - Opens WhatsApp with pre-filled message
- **"Ver no Afternic"** button - Opens Afternic URL in new tab
- City and category tags
- Featured badge if applicable

### Admin Dashboard (`/admin`)

- Login screen requesting admin token
- Token stored in localStorage for persistence
- Create new domains with form
- View all domains in table format
- Edit existing domains
- Delete/deactivate domains
- All operations require valid admin token

## 🔐 Admin Authentication

The admin page uses token-based authentication:

1. User enters token on login screen
2. Token is stored in `localStorage` as `admin_token`
3. All admin API requests include `Authorization: Bearer {token}` header
4. Logout clears the token from localStorage

To set up admin access, ensure your backend validates this token.

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables:
     - `NEXT_PUBLIC_API_BASE`: Your backend API URL
     - `NEXT_PUBLIC_ADMIN_HINT`: Admin hint message
   - Deploy!

3. **Custom Domain (Optional)**
   - Add your custom domain in Vercel dashboard
   - Configure DNS records as instructed

### Other Platforms

This Next.js app can be deployed to:
- **Netlify**: Connect repository, set env vars, deploy
- **AWS Amplify**: Connect repository, configure build settings
- **Self-hosted**: Build and run with Node.js
  ```bash
  npm run build
  npm start
  ```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# Backend API Base URL (required)
NEXT_PUBLIC_API_BASE=http://localhost:3001

# Admin hint displayed on login page (optional)
NEXT_PUBLIC_ADMIN_HINT="Contact support@example.com for admin access"
```

### Tailwind CSS Customization

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your primary color palette
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
      },
    },
  },
}
```

## 📝 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🧪 Testing the Application

1. **Ensure backend is running** on the URL specified in `NEXT_PUBLIC_API_BASE`

2. **Test Home Page**:
   - Visit http://localhost:3000
   - Verify domains are loading
   - Test search and filters
   - Check featured domains section

3. **Test Domain Details**:
   - Click on any domain card
   - Verify all information displays correctly
   - Test WhatsApp button (should open WhatsApp with pre-filled message)
   - Test Afternic button (should open in new tab)

4. **Test Admin Dashboard**:
   - Visit http://localhost:3000/admin
   - Enter your admin token (from backend)
   - Create a new domain
   - Edit existing domain
   - Delete a domain
   - Verify all operations work correctly

## 🐛 Troubleshooting

### Domains not loading

- Check that `NEXT_PUBLIC_API_BASE` is set correctly in `.env.local`
- Verify backend is running and accessible
- Check browser console for API errors
- Verify CORS is enabled on backend

### Admin operations fail

- Ensure admin token is correct
- Check that token is being sent in Authorization header
- Verify backend validates the token correctly
- Check browser console for error messages

### Build errors

- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Run `npm run build`

### WhatsApp button not working

- Verify `whatsapp_number` field is in E.164 format (+5521999998888)
- Check browser console for errors
- Test WhatsApp URL manually

## 🤝 Support

For issues or questions:
1. Check this README thoroughly
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify backend API responses

## 📄 License

This project is private and proprietary. All rights reserved.

## 🎯 Next Steps

After setup:
1. Configure your backend API URL
2. Customize branding (colors, logo, footer)
3. Add your domain data via admin dashboard
4. Test all features thoroughly
5. Deploy to production
6. Configure custom domain (if desired)

---

Built with ❤️ using Next.js 14, TypeScript, and Tailwind CSS
