# UniVerse Backend

A Node.js/Express.js backend API for the UniVerse university social platform.

## Features

- 🔐 Authentication & Authorization (JWT + OAuth)
- 📝 Anonymous Confessions System
- 🛒 Marketplace for Student Items
- 👥 Study Groups Management
- 📅 Campus Events
- 🔔 Real-time Notifications
- 👑 Admin Panel
- 📁 File Upload Support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + OAuth (Google, Microsoft)
- **Language**: TypeScript
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd backend
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Set up the database
\`\`\`bash
npx prisma migrate dev
npx prisma generate
npm run seed
\`\`\`

5. Start the development server
\`\`\`bash
npm run dev
\`\`\`

## API Documentation

API documentation is available at \`/api/docs\` when running the server.

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Start production server
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code
- \`npm run seed\` - Seed database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
