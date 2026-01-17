# GameHub Application Architecture

## Overview
GameHub is a Vue 3 application built with TypeScript that allows users to create and manage lists of games. The application features user authentication, game search functionality, and list management capabilities.

## Project Structure
```
src/
├── App.vue                 # Main application component
├── main.ts                 # Application entry point
├── app/                    # Core application logic
│   ├── router.ts           # Vue Router configuration
│   ├── api/               # API client configuration
│   │   └── baseApi.ts     # Axios instance with interceptors
│   └── stores/            # Pinia stores for state management
│       ├── tokenStore.ts  # Authentication token management
│       └── userStore.ts   # User data management
├── assets/                 # Static assets
├── components/             # Reusable UI components
├── entities/               # Data models and interfaces
│   ├── index.ts           # Export file for entities
│   ├── api/              # API data models
│   │   ├── Game.ts       # Game entity
│   │   ├── GameList.ts    # GameList entity
│   │   └── User.ts        # User entity
├── pages/                 # Page components (route views)
│   ├── auth.page.vue      # Login page
│   ├── register.page.vue  # Registration page
│   ├── home.page.vue      # Home page
│   ├── profile.page.vue   # User profile page
│   ├── list.page.vue      # Game list detail page
│   └── createList.page.vue # Create/edit game list page
├── shared/                # Shared utilities and layouts
└── widgets/                # Widget components
    └── header.vue        # Application header
```

## Architecture Components

### 1. Routing
The application uses Vue Router for navigation with the following routes:
- `/` - Home page
- `/login` - Authentication page
- `/signup` - Registration page
- `/profile` - User profile page
- `/createlist` - Create new game list page
- `/list/:id` - View/edit specific game list

### 2. State Management
The application uses Pinia for state management with two main stores:
- `userStore` - Manages user authentication state and user data
- `tokenStore` - Manages JWT authentication tokens

Both stores use `pinia-plugin-persistedstate` to persist data in localStorage.

### 3. Data Models
The application defines three main entities:
- `User`: User account information
- `Game`: Game information (id, name, description, genreId)
- `GameList`: Collection of games with metadata (id, name, description, games)

### 4. API Integration
The application uses Axios for HTTP requests with:
- Base URL configuration
- Request interceptor for adding authentication headers
- Response interceptor for handling 401 errors and token refresh

### 5. UI Components
The application follows a component-based architecture with:
- Page components that correspond to routes
- Widget components for reusable UI elements (header)
- Shared layout components

## Key Features

### Authentication Flow
1. User registers with username and password
2. User logs in with credentials
3. Server returns JWT access token
4. Token is stored in tokenStore
5. User data is fetched and stored in userStore
6. Token is automatically added to API requests
7. Token refresh is handled on 401 responses

### Game List Management
1. Users can create new game lists
2. Users can search for games by name
3. Games can be added to or removed from lists
4. Lists can be renamed
5. Lists are associated with user accounts

### UI/UX Features
- Responsive design with mobile support
- Dark theme styling
- Loading states for API requests
- Form validation
- Error handling and display
- Smooth transitions and hover effects

## Technologies Used
- Vue 3 with Composition API
- TypeScript for type safety
- Vue Router for routing
- Pinia for state management
- Axios for HTTP requests
- Sass/SCSS for styling
- ts-debounce for debouncing search requests

## Potential Improvements
1. Add proper error handling with user-friendly messages
2. Implement loading states for all async operations
3. Add form validation for all user inputs
4. Implement proper game search with filters
5. Add game details view
6. Implement list sharing functionality
7. Add game ratings and reviews
8. Implement better state management for game lists
9. Add unit tests for components and stores
10. Improve accessibility with proper ARIA attributes