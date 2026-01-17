# GameHub Application: API Integration Patterns

## Overview
The GameHub application uses a centralized Axios instance with interceptors for API communication. This approach provides consistent error handling, authentication management, and request/response processing.

## Core API Client

### Base Configuration
The application uses a single Axios instance configured in `src/app/api/baseApi.ts`:

```typescript
// src/app/api/baseApi.ts
const apiClient = axios.create({
  baseURL: "https://localhost:7272",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor
The request interceptor automatically adds authentication tokens to requests:

```typescript
apiClient.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### Response Interceptor
The response interceptor handles token refresh and global error management:

```typescript
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const tokenStore = useTokenStore();
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      
      try {
        const refreshResponse = await axios.post(`${url}/auth/refresh`, {}, { withCredentials: true });
        tokenStore.setToken(refreshResponse.data);
        originalRequest.headers.Authorization = `Bearer ${tokenStore.getAccessToken()}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenStore.clearToken();
        router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

### User Management
- `GET /user/me` - Get current user information

### Game Management
- `GET /game/name/{name}` - Search games by name

### Game List Management
- `GET /gamelists/user/{userId}` - Get user's game lists
- `GET /gamelists/{id}` - Get specific game list
- `POST /gamelists` - Create new game list
- `PATCH /gamelists/` - Update game list
- `PATCH /gamelists/addgame` - Add game to list
- `PATCH /gamelists/removegame` - Remove game from list

## Usage Patterns

### Direct API Calls
Components directly import and use the API client:

```typescript
// In component
import apiClient from '@/app/api/baseApi';

const response = await apiClient.get('/user/me');
```

### Data Construction
API responses are processed through constructor functions:

```typescript
// src/entities/api/GameList.ts
export const constructGameList = (data: any): GameList => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    games: data.games ?? []
  }
}
```

## Error Handling Patterns

### Component-Level Error Handling
Components implement try/catch blocks for API calls:

```typescript
try {
  const response = await apiClient.get('/game/name/${name}');
  searchResults.value = response.data;
} catch (err) {
  console.error("Ошибка поиска", err);
  searchResults.value = [];
}
```

### Global Error Handling
The response interceptor handles 401 errors and token refresh automatically.

## Current Limitations

### 1. No Centralized Error Handling
Each component implements its own error handling logic, leading to inconsistency.

### 2. Direct API Calls in Components
Components directly call API endpoints, mixing UI logic with data fetching.

### 3. Limited Request/Response Processing
No advanced request/response transformation or caching.

### 4. No Request Cancelation
No mechanism to cancel pending requests when components unmount.

## Proposed Improvements

### 1. Service Layer Implementation
Create dedicated service files for each domain:

```typescript
// src/services/gameService.ts
class GameService {
  async searchGames(name: string): Promise<Game[]> {
    const response = await apiClient.get(`/game/name/${name}`);
    return response.data;
  }
}

export const gameService = new GameService();
```

### 2. Enhanced Error Handling
Implement centralized error handling with user-friendly messages:

```typescript
// src/utils/errorHandler.ts
export class ErrorHandler {
  static handleApiError(error: any): string {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return "Пожалуйста, войдите в систему";
        case 403:
          return "У вас нет доступа к этому ресурсу";
        case 404:
          return "Ресурс не найден";
        case 500:
          return "Внутренняя ошибка сервера";
        default:
          return error.response.data?.message || "Произошла ошибка";
      }
    }
    return "Ошибка соединения с сервером";
  }
}
```

### 3. Request Cancelation
Implement request cancelation for better resource management:

```typescript
// In component
import { onUnmounted } from 'vue';

const controller = new AbortController();

onUnmounted(() => {
  controller.abort();
});

const response = await apiClient.get('/game/name/${name}', {
  signal: controller.signal
});
```

### 4. Response Caching
Implement simple caching mechanism for frequently requested data:

```typescript
// src/utils/cache.ts
class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < 5 * 60 * 1000) { // 5 minutes
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}
```

## Best Practices for API Integration

### 1. Consistent Error Handling
- Implement centralized error handling
- Provide user-friendly error messages
- Log errors for debugging purposes
- Handle different error types appropriately

### 2. Proper Data Validation
- Validate API responses before using them
- Implement proper TypeScript interfaces
- Handle missing or unexpected data gracefully

### 3. Efficient Resource Management
- Cancel pending requests when components unmount
- Implement caching for frequently requested data
- Handle loading states properly

### 4. Security Considerations
- Store tokens securely
- Implement proper authentication flow
- Handle token expiration gracefully
- Validate user permissions

### 5. Performance Optimization
- Implement request debouncing for search
- Use pagination for large datasets
- Optimize API response sizes
- Implement lazy loading where appropriate

## Implementation Roadmap

### Phase 1: Immediate Improvements
1. Implement centralized error handling
2. Add request cancelation support
3. Improve data validation

### Phase 2: Medium-term Enhancements
1. Create service layer
2. Implement response caching
3. Add request/response logging

### Phase 3: Long-term Optimizations
1. Implement advanced caching strategies
2. Add offline support
3. Implement request batching

This documentation provides a comprehensive overview of the current API integration patterns and proposes improvements to enhance the application's maintainability, performance, and user experience.