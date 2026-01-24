# 🚀 Renderex

> **An Note-Taking Website with AI-Driven Intelligence**

Renderex is a modern, full-stack note-taking app that revolutionizes how you write, organize, and interact with your notes. Built with cutting-edge technologies, it combines real-time markdown editing, AI assistance, advanced formatting capabilities, and seamless export options into one powerful platform.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Redux](https://img.shields.io/badge/Redux-5.0-764abc?style=for-the-badge&logo=redux)](https://redux.js.org/)

---

## ✨ Key Features

### 📝 **Advanced Markdown Editor**
- **Real-time rendering** with live outline
- **CodeMirror integration** for code editing vibes
- **Custom markdown extensions** with remark and rehype plugins

### 🤖 **AI-Driven Intelligence**
- **Google Gemini 2.5 Flash** integration for smart content generation
- **Context-aware suggestions** to enhance your writing
- **AI-assisted formatting** and content improvement
- **Natural language processing** for smart queries

### 🎨 **Rich Formatting & Download**
- **PDF** - Download your notes in formatted PDFs
- **DOCX** - Convert notes to Microsoft Word documents
- **Markdown** - Keep your notes portable and accessible
- **TEXT** with nice styling

### 🏷️ **Intelligent Organization**
- **Tag System** - Organize notes with custom tags
- **Advanced search** capabilities
- **Filtering and sorting** options
- **Tag-based navigation** for quick access

### 🔐 **Secure Authentication**
- **Firebase Authentication** with email/key
- **Protected routes** and session management
- **User-specific data isolation**
- **Secure server-side actions**

### 🎭 **Modern UI/UX**
- **Dark/Light theme** done with next-themes
- **Smooth animations** done with Framer Motion
- **Responsive design** for all devices
- **Radix UI components** for accessibility

---

## 🏗️ Project Architecture

### **Core Technologies**

```
📦 Frontend Framework
├── Next.js 16.1 (App Router)
├── React 19.2
└── TypeScript 5.0

🔄 State Management
├── Redux Toolkit 2.11
├── React Redux 9.2
└── Redux Persist

🎨 Styling
├── Tailwind CSS 4.0
├── Framer Motion 12.25
└── Radix UI

🔥 Backend & Database
├── Firebase 12.7
├── Firebase Admin 13.6
└── Firestore Database

🤖 AI Integration
├── Google Gemini AI
└── @google/genai 1.34

📝 Editor & Rendering
├── CodeMirror 6.5
├── React Markdown 10.1
├── React PDF Renderer 4.3.1
└── DOCX 9.5.1

🧪 Testing
├── Jest 30.2
├── React Testing Library 16.3
└── MSW 2.12 (API Mocking)
```

---

## 📂 Project Structure

### **Root Directory**
```
renderex/
├── src/                    # Source code
├── __tests__/              # Test suites
├── redux/                  # Redux store configuration
├── public/                 # Static assets
├── e2e/                    # End-to-end tests
├── constants/              # App constants
└── coverage/               # Test coverage reports
```

### **`src/` - Application Source**

#### **`src/app/` - Next.js App Router**
```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Landing page
├── globals.css             # Global styles
├── (auth)/                 # Authentication routes
│   ├── sign-in/           # Sign-in page
│   └── sign-up/           # Registration page
└── dashboard/             # Protected dashboard area
    ├── layout.tsx         # Dashboard layout
    ├── page.tsx           # Dashboard home
    ├── note/              # Individual note view
    └── account/           # User account settings
```

#### **`src/components/` - React Components**

```
components/
├── auth/                   # Authentication components
│   ├── SignInForm.tsx     # Login form with validation
│   └── SignUpForm.tsx     # Registration form
│
├── notes/                  # Note management components
│   ├── Editor.tsx         # CodeMirror markdown editor
│   ├── LiveRenderer.tsx   # Real-time markdown preview
│   ├── Sidebar.tsx        # Notes list sidebar
│   ├── DialogNote.tsx     # Note creation/edit dialog
│   ├── EditorActions.tsx  # Editor toolbar actions
│   ├── SelectFormat.tsx   # Export format selector
│   └── Sandbox.tsx        # Isolated environment
│
├── tags/                   # Tag management system
│   ├── TagsList.tsx       # Display all tags
│   ├── TagFilter.tsx      # Filter notes by tags
│   └── TagManager.tsx     # Create/edit tags
│
├── landing/                # Landing page sections
│   ├── hero/              # Hero section with animations
│   ├── features/          # Feature showcase
│   ├── about/             # About section
│   └── usage/             # How to use guide
│
├── layout/                 # Layout components
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer
│   └── Sidebar.tsx        # App sidebar
│
├── shared/                 # Shared/reusable components
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
│
└── ui/                     # Shadcn UI components
    ├── button.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    ├── tabs.tsx
    └── ... (more UI elements)
```

#### **`src/actions/` - Server Actions**

Next.js Server Actions for secure server-side operations:

```
actions/
├── ai.ts                   # AI generation with Gemini
│   └── aiDo()             # Generate AI content
│
├── notes.ts                # Note CRUD operations
│   ├── getInitialNotes()  # Fetch user notes
│   ├── createNote()       # Create new note
│   ├── updateNote()       # Update existing note
│   └── deleteNote()       # Delete note
│
├── tags.ts                 # Tag management
│   ├── getTags()          # Fetch all tags
│   ├── createTag()        # Create new tag
│   ├── updateTag()        # Update tag
│   └── deleteTag()        # Delete tag
│
├── format.ts               # Format functions
│   ├── getDOCX()          # Format for Word
│   ├── getPDF()           # Format for PDF
│   └── getMD()            # Format for Markdown
│
└── user.ts                 # User functions
    ├── getUserData()      # Fetch user account data
    └── updateProfile()    # Update user settings
```

#### **`src/hooks/` - Custom React Hooks**

Organized by feature domain for maintainability:

```
hooks/
├── ai/
│   ├── useAiGenerate.ts   # AI content generation
│   └── useAiHistory.ts    # AI interaction history
│
├── notes/
│   ├── useNotes.ts        # Notes state management
│   ├── useCreateNote.ts   # Create note logic
│   ├── useUpdateNote.ts   # Update note logic
│   └── useDeleteNote.ts   # Delete note logic
│
├── tags/
│   ├── useTags.ts         # Tags state management
│   └── useTagFilter.ts    # Tag filtering logic
│
├── format/
│   ├── useExport.ts       # Download functionality
│   └── useFormatSelect.ts # Format selection
│
├── user/
│   ├── useAuth.ts         # Authentication state
│   └── useUser.ts         # User data management
│
└── shared/
    ├── useDebounce.ts     # Debounce utility
    ├── useLocalStorage.ts # Local storage sync
    └── useMediaQuery.ts   # Design && Mediaquery utilities
```

#### **`src/lib/` - Utilities & Configuration**

```
lib/
├── firebase/
│   ├── admin.ts           # Firebase Admin SDK (server-side)
│   ├── client.ts          # Firebase Client SDK (client-side)
│   └── config.ts          # Firebase configuration
│
├── auth/
│   ├── requireUserId.ts   # User ID validation middleware
│   └── session.ts         # Session management
│
└── utils.ts               # General utility functions (cn, etc.)
```

#### **`src/types/` - TypeScript Type Definitions**

```
types/
├── notesArgs.ts           # Note data structure
├── tag.ts                 # Tag interface
├── user.ts                # User profile types
└── dialogNotesArgs.ts     # Dialog-specific types
```

#### **`src/utils/` - Helper Functions**

```
utils/
├── date/
│   └── formatDate.ts      # Date formatting utilities
│
├── color/
│   └── getRandomHexColor.ts # Color generation for tags
│
└── download/
    ├── Pdf.tsx            # PDF template
    └── downloadFile.ts    # File download handler
```

---

### **`redux/` - State Management**

```
redux/
├── store.ts               # Redux store configuration
├── StoreProvider.tsx      # React Redux provider wrapper
│
└── slices/                # Redux slices
    ├── notesSlice.ts      # Notes state management
    ├── tagsSlice.ts       # Tags state management
    ├── userSlice.ts       # User state management
    ├── aiSlice.ts         # AI interaction state
    ├── formatSlice.ts     # Format preferences
    └── sandboxSlice.ts    # Outlined sandbox state
```

**State Architecture:**
- **Notes Slice**: Manages all note data, CRUD functions, and filtering
- **Tags Slice**: Handles tag creation, assignment, and filtering
- **User Slice**: Stores user profile and preferences
- **AI Slice**: Tracks AI requests, responses, and history
- **Format Slice**: Manages export format preferences and settings
- **Sandbox Slice**: Controls outlined mode and rendering

---

### **`__tests__/` - Testing Suite**

```
__tests__/
├── unit/                  # Unit tests
│   ├── formatDate.test.ts
│   ├── hexColor.test.ts
│   ├── requireUserId.test.ts
│   └── sanitize.test.ts
│
└── integration/           # Integration tests
    ├── auth.test.ts
    ├── notes-crud.test.ts
    └── export.test.ts
```

**Testing Strategy:**
- **Unit Tests**: Individual function and utility testing
- **Integration Tests**: React-functions and feature interaction testing
- **Coverage**: Detailed test coverage with generated website
- **Mocking**: MSW for API mocking in tests

---

### **`constants/` - Application Constants**

```
constants/
├── authErrors.ts          # Authentication error messages
├── dateFormats.ts         # Date format patterns
├── Format.ts              # Differnet format definitions
│
└── loading-states/        # Loading state management
    ├── AiState.ts         # AI loading states
    └── ContentState.ts    # Content loading states
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** / **yarn** / **pnpm** / **bun**
- **Firebase Account** (for authentication and database)
- **Google AI API Key** (for Gemini AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/renderex.git
   cd renderex
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Firebase Admin (Server-side)
   FIREBASE_ADMIN_PROJECT_ID=your_firebase_project_id
   FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_client_email

   # Google AI (Gemini)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🧪 Testing

Renderex includes a comprehensive testing suite with Jest and React Testing Library.

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run testw

# Run tests with coverage report
npm run testc
```

### Test Coverage

Coverage documentation are generated in the `coverage/` directory:
- **HTML**: `coverage/lcov/index.html`
- **JSON**: `coverage/coverage-final.json`
- **LCOV**: `coverage/lcov.info`

---

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

---

## 🛠️ Tech Stack Deep Dive

### **Frontend**
- **Next.js 16.1**: React framework with App Router, "use server" functions, and server actions
- **React 19.2**: Latest React
- **TypeScript 5.0**: Type-safe development with full IDE support
- **Tailwind CSS 4.0**: Utility-first CSS framework with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible, unstyled UI primitives

### **State Management**
- **Redux Toolkit**: Modern Redux with API
- **React Redux**: React bindings for Redux

### **Editor**
- **CodeMirror 6**: Code editor with markdown integration
- **React Markdown**: Markdown rendering with custom elements
- **Rehype**: HTML processor for syntax highlighting

### **AI Integration**
- **Google Gemini 2.5 Flash**: State-of-the-art language model
- **@google/genai**: Official Google AI SDK

### **Export & Formatting**
- **React PDF Renderer**: Generate PDFs in React
- **DOCX**: Create Microsoft Word documents
- **Strip Markdown**: Plain text extraction

### **Backend**
- **Firebase**: Authentication, database, and hosting
- **Firestore**: NoSQL cloud database
- **Firebase Admin**: Server-side Firebase operations

### **Testing**
- **Jest**: TS testing framework
- **React Testing Library**: React testing
- **MSW**: API mocking for tests
- **jest-environment-jsdom**: DOM environment for tests

### **Development Tools**
- **ESLint**: Code linting and style enforcement
- **Prettier** (via ESLint): Code formatting
- **TypeScript**: Static type checking

---

## 🎯 Use Cases

### **Students**
- Take lecture notes with markdown formatting
- Organize notes with tags and categories
- Download notes as PDFs for study guides
- Use AI to expand on concepts

### **Developers**
- Document code
- Create technical documentation
- Syntax highlighting for code snippets
- Download as markdown for GitHub

### **Writers**
- Draft articles and blog posts
- Organize ideas with tags
- AI-assisted writing messages
- Download to Word or PDF for publishing

### **Teams**
- Collaborative note-taking
- Shared knowledge base
- Standardized formatting
- Easy download and sharing

---

## 🔒 Security

- **Firebase Authentication**: Secure user authentication with industry standards
- **Protected Routes**: Server-side validation of user sessions
- **Environment Variables**: Sensitive data stored securely
- **Input Sanitization**: Protection against XSS and injection attacks
- **CORS Configuration**: Proper cross-origin resource sharing
- **Type Safety**: TypeScript for compile-time error catching

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

**Built with motivation using Next.js, TypeScript, and Firebase**

[✅Like](https://github.com/yourusername/renderex) | [🐛Bug](https://github.com/yourusername/renderex/issues) | [👽 Request Feature](https://github.com/yourusername/renderex/issues)

</div>
