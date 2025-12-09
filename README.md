# Heart Casino

A desktop casino game application developed for the Distributed Service Architecture module (2523179) at the University of Bedfordshire, 2025. Built with Electron, React, TypeScript, and Supabase.

## Table of Contents

1. [Software Architecture (Low Coupling / High Cohesion)](#1-software-architecture-low-coupling--high-cohesion)
2. [Event Driven Architectures](#2-event-driven-architectures)
3. [Interoperability](#3-interoperability)
4. [Virtual Identity](#4-virtual-identity)
5. [Other Interesting Features](#5-other-interesting-features)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)

---

## 1. Software Architecture (Low Coupling / High Cohesion)

### Architecture Overview

The application follows a **layered architecture** with clear separation of concerns, ensuring **low coupling** between modules and **high cohesion** within each module.

### Directory Structure

```
src/
├── main/              # Electron main process (backend)
│   ├── ipc/          # IPC handlers (communication layer)
│   ├── services/     # Business logic services
│   └── windows/      # Window management
├── renderer/         # Electron renderer process (frontend)
│   ├── adapters/     # IPC communication adapters
│   ├── components/   # React UI components
│   ├── contexts/     # React context providers
│   ├── screens/      # Screen/page components
│   └── routes.tsx    # Route definitions
├── preload/          # Preload scripts (bridge between main/renderer)
├── shared/           # Shared types and constants
└── lib/              # Shared libraries and utilities
```

### High Cohesion Modules

Each module is designed with **high cohesion**, meaning related functionality is grouped together:

#### 1. **Blackjack Service Module** (`src/main/services/blackjack/`)
- **Purpose**: All blackjack game logic in one cohesive unit
- **Responsibilities**:
  - Card deck creation and shuffling
  - Hand evaluation and scoring
  - Game state management
  - Win/loss determination
  - Game flow control (hit, stand, double down)
- **Files**: `blackjackService.ts`

#### 2. **User Service Module** (`src/main/services/user/`)
- **Purpose**: Complete user management functionality
- **Responsibilities**:
  - Authentication (sign up, sign in, sign out)
  - Session management
  - User profile operations
  - Balance management
- **Files**: `userService.ts`

#### 3. **Heart Game Service Module** (`src/main/services/heart/`)
- **Purpose**: Heart puzzle game integration
- **Responsibilities**:
  - API communication with Heart API
  - Puzzle fetching and validation
  - Solution verification
  - Reward calculation
- **Files**: `heartService.ts`

#### 4. **Game History Service Module** (`src/main/services/gamehistory/`)
- **Purpose**: Game history and statistics
- **Responsibilities**:
  - Recording game results
  - Fetching user game history
  - Calculating user statistics
- **Files**: `gameHistoryService.ts`

#### 5. **IPC Handler Modules** (`src/main/ipc/`)
- **Purpose**: Centralized IPC communication handlers
- **Responsibilities**:
  - Registering IPC channels
  - Handling requests from renderer process
  - Coordinating service calls
- **Files**: 
  - `blackjackHandlers.ts`
  - `userHandlers.ts`
  - `heartHandlers.ts`
  - `gameHistoryHandlers.ts`
  - `register.ts` (central registration)

### Low Coupling Design

The architecture achieves **low coupling** through several design patterns:

#### 1. **Adapter Pattern**
The renderer process communicates with the main process through adapters, creating a clean abstraction:

```typescript
// src/renderer/adapters/blackjackAdapter.ts
export class BlackjackAdapter {
  static async startGame(userId: string, bet: number): Promise<BlackjackGame> {
    const response = await window.electron.ipcRenderer.invoke<APIResponse<BlackjackGame>>(
      IPC_CHANNELS.BLACKJACK.START_GAME, 
      userId, 
      bet
    );
    // ...
  }
}
```

#### 2. **Service Layer Pattern**
Business logic is isolated in service classes, independent of UI or IPC concerns:

```typescript
// src/main/services/blackjack/blackjackService.ts
class BlackjackService {
  startGame(userId: string, bet: number): BlackjackGame { /* ... */ }
  hit(gameId: string): BlackjackGame { /* ... */ }
  stand(gameId: string): BlackjackGame { /* ... */ }
}
```

#### 3. **Shared Types**
Common types are defined in the `shared/` directory, ensuring type safety across layers without tight coupling:

```typescript
// src/shared/blackjackTypes.ts
export interface BlackjackGame {
  gameId: string;
  playerHand: Hand;
  dealerHand: Hand;
  // ...
}
```

#### 4. **Centralized Channel Management**
IPC channels are defined in a single location, reducing coupling between components:

```typescript
// src/shared/channels.ts
export const IPC_CHANNELS = {
  BLACKJACK: {
    START_GAME: 'blackjack:start-game',
    HIT: 'blackjack:hit',
    // ...
  },
  USER: { /* ... */ },
  HEART: { /* ... */ },
} as const;
```

### Separation of Concerns

- **Presentation Layer** (`renderer/`): React components, UI logic, user interactions
- **Application Layer** (`main/services/`): Business logic, game rules, data processing
- **Communication Layer** (`main/ipc/`, `renderer/adapters/`): IPC handlers and adapters
- **Data Layer** (`lib/dbClient.ts`): Database access through Supabase
- **Shared Layer** (`shared/`): Common types, constants, utilities

---

## 2. Event Driven Architectures

The application uses an **event-driven architecture** at multiple levels, responding to various events throughout the system.

### Event Types

#### 1. **User Interface Events (React)**

User interactions trigger events that flow through the application:

**Button Clicks:**
- Login/Registration buttons → Authentication events
- Game action buttons (Hit, Stand, Double Down) → Game state change events
- Navigation buttons → Route change events

**Example from `BlackjackGameScreen.tsx`:**
```typescript
const handleHit = async () => {
  if (!game) return;
  setIsLoading(true);
  try {
    const updatedGame = await BlackjackAdapter.hit(game.gameId);
    setGame(updatedGame);
    // Event: Game state updated
    if (updatedGame.state === 'game-over') {
      handleGameOver(updatedGame); // Event: Game completion
    }
  } catch (err) {
    showAlert('error', 'Error', err.message); // Event: Error notification
  }
};
```

**Form Submissions:**
- Login form → Authentication request
- Registration form → User creation request
- Profile edit form → Profile update request

#### 2. **IPC Events (Electron Inter-Process Communication)**

The application uses Electron's IPC system for communication between the main and renderer processes:

**IPC Channels:**
```typescript
// src/shared/channels.ts
export const IPC_CHANNELS = {
  USER: {
    SIGN_UP: 'user:sign-up',
    SIGN_IN: 'user:sign-in',
    SIGN_OUT: 'user:sign-out',
    GET_SESSION: 'user:get-session',
    // ...
  },
  BLACKJACK: {
    START_GAME: 'blackjack:start-game',
    HIT: 'blackjack:hit',
    STAND: 'blackjack:stand',
    // ...
  },
  HEART: {
    FETCH_PUZZLE: 'heart:fetch-puzzle',
    VALIDATE_SOLUTION: 'heart:validate-solution',
  },
  GAME_HISTORY: {
    CREATE_RECORD: 'game-history:create-record',
    GET_USER_HISTORY: 'game-history:get-user-history',
    // ...
  },
}
```

**Event Flow Example:**
1. User clicks "Hit" button in UI
2. `BlackjackAdapter.hit()` is called
3. IPC event `'blackjack:hit'` is sent to main process
4. `blackjackHandlers.ts` receives the event
5. `blackjackService.hit()` processes the request
6. Response is sent back via IPC
7. UI updates with new game state

#### 3. **React Context Events**

The `UserContext` provides event-driven state management:

```typescript
// src/renderer/contexts/UserContext.tsx
export function UserProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // Event: Session refresh triggered
  const refreshSession = useCallback(async () => {
    // Updates all components subscribed to UserContext
  }, []);

  // Event: User signs out
  const signOut = async () => {
    await UserAdapter.signOut();
    // Clears all user state
  };
}
```

#### 4. **Route Navigation Events**

React Router triggers navigation events:

```typescript
// src/renderer/routes.tsx
<Route
  element={
    <ProtectedRoute>
      <BlackjackGameScreen />
    </ProtectedRoute>
  }
  path="/blackjack"
/>
```

**Protected Routes** check authentication status and trigger redirect events if unauthorized.

#### 5. **Game State Events**

Game state changes trigger cascading events:

**Blackjack Game Flow:**
1. **Game Start Event** → Initializes game, deals cards
2. **Card Deal Event** → Updates UI with new cards
3. **Player Action Event** (Hit/Stand/Double Down) → Updates game state
4. **Game Over Event** → Triggers:
   - Balance update
   - Game history record creation
   - UI state change
   - Navigation option

**Heart Game Flow:**
1. **Puzzle Fetch Event** → Requests puzzle from API
2. **Solution Submit Event** → Validates solution
3. **Validation Result Event** → Updates balance, records history

#### 6. **Database Events**

Supabase provides real-time capabilities (though not extensively used in this implementation), but database operations trigger events:
- User authentication → Session creation event
- Profile update → State refresh event
- Game record creation → History update event

### Event-Driven Benefits

1. **Decoupling**: Components don't need direct references to each other
2. **Scalability**: Easy to add new event handlers
3. **Maintainability**: Clear event flow makes debugging easier
4. **Responsiveness**: UI updates reactively to state changes

---

## 3. Interoperability

The application demonstrates interoperability through integration with multiple external systems and protocols.

### External API Integration

#### 1. **Heart Game API**

**Endpoint**: `http://marcconrad.com/uob/heart/api.php`

**Protocol**: **JSON over HTTP**

**Implementation:**
```typescript
// src/main/services/heart/heartService.ts
export class HeartGameService {
  private baseUrl = 'http://marcconrad.com/uob/heart/api.php';

  async fetchPuzzle(): Promise<HeartPuzzle> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data: HeartAPIResponse = await response.json();
    // Returns: { question: string, solution: number, carrots: number }
    return {
      question: data.question,
      solution: data.solution,
      carrots: data.carrots,
    };
  }
}
```

**Data Format:**
- **Request**: HTTP GET request with JSON Accept header
- **Response**: JSON object with `question`, `solution`, and `carrots` fields
- **Validation**: Client-side solution validation (no server-side submission)

**Integration Points:**
- `src/main/services/heart/heartService.ts` - Service layer
- `src/main/ipc/heartHandlers.ts` - IPC handlers
- `src/renderer/adapters/heartAdapter.ts` - Renderer adapter
- `src/renderer/screens/HeartGameScreen.tsx` - UI component

#### 2. **Supabase Integration**

**Protocol**: **REST API with JSON** (via Supabase JavaScript client)

**Services Used:**
- **Authentication**: Email/password authentication
- **Database**: PostgreSQL database with REST API
- **Storage**: (Not used in current implementation)

**Implementation:**
```typescript
// src/lib/dbClient.ts
export function getSupabaseClient(): SupabaseClient {
  // Returns configured Supabase client
}

// src/main/services/user/userService.ts
async signIn(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password,
  });
  return data;
}
```

**Data Interchange:**
- **Authentication**: JWT tokens for session management
- **Database Queries**: JSON request/response format
- **Error Handling**: Structured error objects

### Internal Communication Protocols

#### 1. **IPC (Inter-Process Communication)**

**Protocol**: Electron's IPC system with typed channels

**Message Format:**
```typescript
// Request
window.electron.ipcRenderer.invoke<APIResponse<T>>(
  channel: Channel,
  ...args: unknown[]
): Promise<T>

// Response
{
  success: boolean;
  data?: T;
  error?: string;
}
```

**Channels**: Defined in `src/shared/channels.ts` with type safety

#### 2. **Local Storage**

**Protocol**: Browser localStorage API

**Data Format**: JSON strings

**Usage:**
- Session persistence
- User data caching
- Profile data storage

```typescript
// Example from LoginScreen.tsx
localStorage.setItem('session', JSON.stringify(session));
localStorage.setItem('user', JSON.stringify(user));
```

### Data Formats

1. **JSON**: Primary format for all API communications
2. **TypeScript Types**: Type-safe data structures across layers
3. **JWT Tokens**: Authentication tokens from Supabase
4. **HTTP**: Standard HTTP protocol for external APIs

### Interoperability Benefits

- **Standard Protocols**: Uses widely-supported JSON and HTTP
- **Type Safety**: TypeScript ensures data consistency
- **Error Handling**: Structured error responses
- **Extensibility**: Easy to add new API integrations

---

## 4. Virtual Identity

The application implements a comprehensive **virtual identity system** for users, managing authentication, profiles, and user data.

### Identity Components

#### 1. **Authentication System**

**Method**: Email and Password Authentication via Supabase

**Implementation:**
```typescript
// src/main/services/user/userService.ts
async signUp(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signUp({
    email,
    password,
  });
  return data;
}

async signIn(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password,
  });
  return data;
}
```

**Security Features:**
- Password hashing (handled by Supabase)
- Session token management
- Secure token storage

#### 2. **Session Management**

**Storage Methods:**
- **Supabase Session**: Server-side session management
- **Local Storage**: Client-side session persistence
- **React Context**: In-memory session state

**Implementation:**
```typescript
// src/renderer/contexts/UserContext.tsx
const refreshSession = useCallback(async () => {
  const currentSession = await UserAdapter.getSession();
  setSession(currentSession);
  
  if (currentSession?.user) {
    localStorage.setItem('session', JSON.stringify(currentSession));
    localStorage.setItem('user', JSON.stringify(currentSession.user));
  }
}, []);
```

**Session Components:**
- **Access Token**: JWT token for API authentication
- **Refresh Token**: Token for session renewal
- **User ID**: Unique identifier for the user
- **Expiration**: Automatic session expiration handling

#### 3. **User Profile System**

**Profile Data Structure:**
```typescript
// Stored in Supabase 'profiles' table
{
  id: string;              // User UUID (from auth.users)
  display_name: string;    // User's chosen display name
  gender: 'male' | 'female';
  avatar: string;          // Avatar image path
  balance: number;        // Virtual currency balance
  created_at: timestamp;
  updated_at: timestamp;
}
```

**Profile Features:**
- **Display Name**: Customizable username
- **Avatar Selection**: Gender-specific avatar choices
- **Balance Tracking**: Virtual currency management
- **Profile Editing**: Users can update their profile

**Implementation:**
```typescript
// src/main/services/user/userService.ts
async updateProfile(
  userId: string,
  profileData: {
    display_name: string;
    gender: string;
    avatar: string;
  }
) {
  const { data, error } = await client.from('profiles').upsert({
    id: userId,
    ...profileData,
    updated_at: new Date().toISOString(),
  });
  return data;
}
```

#### 4. **Virtual Currency System**

**Balance Management:**
- Initial balance on registration
- Balance updates after games
- Balance tracking in database
- Real-time balance display

**Implementation:**
```typescript
// src/main/services/user/userService.ts
async updateBalance(
  userId: string,
  amount: number,
  operation: 'add' | 'subtract' | 'set'
) {
  const currentBalance = await this.getCurrentBalance(userId);
  let newBalance: number;
  
  switch (operation) {
    case 'add':
      newBalance = currentBalance + amount;
      break;
    case 'subtract':
      newBalance = Math.max(0, currentBalance - amount);
      break;
    case 'set':
      newBalance = amount;
      break;
  }
  
  // Update in database
  await client.from('profiles').update({ balance: newBalance });
}
```

#### 5. **Game History & Statistics**

**Identity Tracking:**
- All games are associated with user ID
- Game history records user performance
- Statistics calculated per user

**Implementation:**
```typescript
// src/main/services/gamehistory/gameHistoryService.ts
async createGameRecord(request: CreateGameHistoryRequest) {
  await client.from('game_history').insert({
    user_id: request.user_id,
    game_type: request.game_type,
    result: request.result,
    score: request.score,
    // ...
  });
}
```

### Identity Persistence

1. **Database**: User data stored in Supabase PostgreSQL database
2. **Local Storage**: Session and profile cached locally
3. **Memory**: Active session in React Context

### Identity Features

- ✅ **Email/Password Authentication**
- ✅ **Session Management** (JWT tokens)
- ✅ **User Profiles** (display name, avatar, gender)
- ✅ **Virtual Currency** (balance tracking)
- ✅ **Game History** (per-user records)
- ✅ **Statistics** (wins, losses, chips won/lost)
- ✅ **Profile Customization** (avatar selection, display name)

### Security Considerations

- Passwords are never stored in plain text (handled by Supabase)
- Session tokens are securely managed
- User data is isolated by user ID
- Protected routes require authentication
- API calls are authenticated with session tokens

---

## 5. Other Interesting Features

### 1. **Electron Desktop Application**

The application is built as a **cross-platform desktop app** using Electron:
- **Main Process**: Node.js backend for game logic and database operations
- **Renderer Process**: React frontend for UI
- **Preload Scripts**: Secure bridge between main and renderer processes
- **Window Management**: Custom window creation and management

### 2. **TypeScript Type Safety**

Comprehensive TypeScript usage ensures type safety across all layers:
- Shared type definitions in `src/shared/`
- Type-safe IPC channels
- Type-safe API responses
- Type-safe component props

### 3. **React Router with Protected Routes**

**Route Protection:**
```typescript
// src/renderer/components/ProtectedRoute.tsx
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

**Public Routes**: Login and registration screens are only accessible when not authenticated.

### 4. **Blackjack Game Engine**

Complete blackjack implementation with:
- Card deck management (52-card deck)
- Hand evaluation (Ace handling, blackjack detection)
- Dealer AI (hits on < 17)
- Game states (dealing, player-turn, dealer-turn, game-over)
- Betting system
- Payout calculation (blackjack: 2.5x, win: 2x, push: 1x)

### 5. **Heart Puzzle Game Integration**

Integration with external Heart API:
- Puzzle fetching from external API
- Client-side solution validation
- Reward system (100 coins for correct solution)
- Session tracking for puzzle attempts
- Automatic balance updates on success

### 6. **Game History System**

Comprehensive game tracking:
- Records for both Blackjack and Heart games
- Tracks: result, scores, duration, chips won/lost
- User statistics calculation
- History viewing interface

### 7. **Responsive UI Components**

Reusable React components:
- `Button`, `Input`, `Card`, `Modal`
- `AvatarSelector` with gender-specific options
- `ProfileHeader` for user information display
- `Navigation` component for routing
- `TitleBar` for window controls

### 8. **Error Handling**

Structured error handling throughout:
- Try-catch blocks in async operations
- User-friendly error messages
- Error logging for debugging
- Graceful fallbacks

### 9. **State Management**

React Context API for global state:
- `UserContext` for authentication and user data
- Automatic session refresh
- Profile state management

### 10. **Build System**

Modern build tooling:
- **Electron Vite**: Fast development and building
- **TypeScript**: Type checking and compilation
- **Biome**: Code formatting and linting
- **Electron Builder**: Application packaging

---

## Project Structure

```
heart_casino/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── ipc/                 # IPC handlers
│   │   ├── services/            # Business logic services
│   │   └── windows/             # Window management
│   ├── renderer/                # Electron renderer (React)
│   │   ├── adapters/            # IPC communication adapters
│   │   ├── components/          # React UI components
│   │   ├── contexts/            # React context providers
│   │   ├── screens/             # Screen/page components
│   │   └── routes.tsx           # Route definitions
│   ├── preload/                 # Preload scripts
│   ├── shared/                  # Shared types and constants
│   └── lib/                     # Shared libraries
├── src/resources/               # Static assets
│   └── public/                  # Images, cards, avatars
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.0.0)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

### Building

```bash
# Build the application
pnpm build
```

### Environment Setup

Create a `.env` file with Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Author

**Chamindu Vidyarathne**  
Email: chamindudvidyarathne@gmail.com

---

## License

MIT

---

## Academic Context

This project was developed for the **Distributed Service Architecture** module (2523179) at the **University of Bedfordshire**, 2025. The project demonstrates:

- Software design principles (low coupling, high cohesion)
- Event-driven programming
- Interoperability with external systems
- Virtual identity management

---

*Last Updated: 2025*

