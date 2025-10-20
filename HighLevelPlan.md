
## 🏗️ **Heart Casino Architecture Design**

### **1. Low Coupling & High Cohesion**

#### **Modular Architecture Layers:**

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  React Components (UI) │ Electron Renderer │ Router System  │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│ Game Logic │ User Management │ Event System │ State Manager │
├─────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                           │
├─────────────────────────────────────────────────────────────┤
│ Heart API │ Supabase │ Card Engine │ AI Opponents │ Analytics│
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│ Local Storage │ Supabase DB │ Game State │ User Profiles   │
└─────────────────────────────────────────────────────────────┘
```

#### **High Cohesion Modules:**

1. **Game Engine Module** - All blackjack logic, card dealing, scoring
2. **User Profile Module** - Authentication, balance, game history
3. **AI Opponent Module** - Gambling behavior patterns, decision making
4. **Heart Game Module** - Logic puzzle integration, scoring system
5. **Event System Module** - Game events, notifications, state changes

#### **Low Coupling Interfaces:**

```typescript
// Abstract interfaces for loose coupling
interface IGameEngine {
  dealCards(): Card[];
  calculateScore(hand: Card[]): number;
  determineWinner(playerHand: Card[], dealerHand: Card[]): GameResult;
}

interface IUserService {
  authenticate(credentials: AuthCredentials): Promise<User>;
  updateBalance(userId: string, amount: number): Promise<void>;
  getGameHistory(userId: string): Promise<GameRecord[]>;
}

interface IHeartGameAPI {
  fetchPuzzle(): Promise<HeartPuzzle>;
  submitSolution(puzzleId: string, solution: string): Promise<boolean>;
}
```

### **2. Event-Driven Programming**

#### **Event System Architecture:**

```typescript
// Central Event Bus
class GameEventBus {
  private listeners: Map<string, Function[]> = new Map();
  
  emit(event: GameEvent): void;
  subscribe(eventType: string, callback: Function): void;
  unsubscribe(eventType: string, callback: Function): void;
}

// Event Types
interface GameEvents {
  'user:authenticated': { user: User };
  'game:started': { gameId: string, players: Player[] };
  'game:card-dealt': { playerId: string, card: Card };
  'game:hand-completed': { playerId: string, result: GameResult };
  'balance:updated': { userId: string, newBalance: number };
  'heart-game:triggered': { userId: string, puzzle: HeartPuzzle };
  'heart-game:completed': { userId: string, success: boolean };
}
```

#### **Event-Driven Game Flow:**

1. **User Authentication** → `user:authenticated` event
2. **Game Start** → `game:started` event triggers UI updates
3. **Card Dealing** → `game:card-dealt` events update all clients
4. **Hand Completion** → `game:hand-completed` triggers balance updates
5. **Balance Zero** → `balance:zero` event triggers Heart Game
6. **Heart Game Success** → `heart-game:completed` restores balance

### **3. Interoperability**

#### **API Integration Strategy:**

```typescript
// Heart Game API Adapter
class HeartGameService {
  private baseUrl = 'http://marcconrad.com/uob/heart/api.php';
  
  async fetchPuzzle(): Promise<HeartPuzzle> {
    const response = await fetch(`${this.baseUrl}?out=json&base64=yes`);
    return this.transformResponse(response);
  }
  
  async submitSolution(puzzle: HeartPuzzle, solution: string): Promise<boolean> {
    // Validate solution logic
    return this.validateSolution(puzzle, solution);
  }
}

// Supabase Integration
class SupabaseService {
  async authenticateUser(email: string, password: string): Promise<User>;
  async saveGameResult(gameResult: GameResult): Promise<void>;
  async updateUserBalance(userId: string, balance: number): Promise<void>;
  async getLeaderboard(): Promise<LeaderboardEntry[]>;
}
```

#### **Data Interchange Formats:**

- **JSON** for Heart Game API communication
- **Supabase** for user data and game persistence
- **Local Storage** for offline game state
- **Event Payloads** for real-time communication

### **4. Virtual Identity**

#### **User Profile System:**

```typescript
interface VirtualIdentity {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  balance: number;
  gameStats: {
    gamesPlayed: number;
    gamesWon: number;
    totalWinnings: number;
    heartGamesCompleted: number;
  };
  preferences: {
    avatar: string;
    theme: 'classic' | 'modern' | 'neon';
    soundEnabled: boolean;
  };
  achievements: Achievement[];
}
```

#### **Identity Management Features:**

1. **Profile Customization** - Avatars, themes, display names
2. **Achievement System** - Badges for milestones and special wins
3. **Leaderboards** - Global and friend rankings
4. **Game History** - Detailed records of all games played
5. **Social Features** - Friend lists, challenges, sharing

### **🏛️ Detailed Architecture Components**

#### **Core Game Modules:**

1. **BlackjackEngine**
   - Card dealing and shuffling
   - Hand evaluation and scoring
   - Game state management
   - Win/loss determination

2. **AIOpponentSystem**
   - Multiple AI personalities (conservative, aggressive, random)
   - Decision-making algorithms
   - Realistic gambling behavior patterns
   - Difficulty scaling

3. **HeartGameIntegration**
   - Puzzle fetching from API
   - Solution validation
   - Progress tracking
   - Reward calculation

4. **UserManagement**
   - Authentication with Supabase
   - Profile management
   - Balance tracking
   - Game history storage

#### **Event-Driven Communication:**

```typescript
// Example event flow for a complete game
const gameFlow = {
  'user:login' → 'game:lobby:join' → 'game:start' → 
  'game:deal' → 'game:player:action' → 'game:dealer:play' → 
  'game:result' → 'balance:update' → 'game:history:save'
};
```

#### **Data Flow Architecture:**

```
User Input → Event Bus → Game Logic → State Update → UI Refresh
     ↓
Database Sync ← Supabase ← Event Handler ← Game Result
```

### **🎯 Implementation Strategy**

#### **Phase 1: Core Infrastructure**
- Set up event system and basic game engine
- Implement Supabase authentication
- Create basic UI components

#### **Phase 2: Game Logic**
- Implement Blackjack engine
- Add AI opponent system
- Integrate Heart Game API

#### **Phase 3: Advanced Features**
- Achievement system
- Leaderboards
- Social features
- Advanced AI behaviors

#### **Phase 4: Polish & Optimization**
- Performance optimization
- Advanced animations
- Sound effects
- Mobile responsiveness

This architecture demonstrates all four principles through:
- **Low Coupling**: Modular design with clear interfaces
- **High Cohesion**: Related functionality grouped together
- **Event-Driven**: Reactive system responding to game events
- **Interoperability**: Multiple API integrations and data formats
- **Virtual Identity**: Comprehensive user profile and social system

The design supports your casino concept while providing a solid foundation for the academic demonstration of these software engineering principles.


/cdv/apps/heart_casino/src
  ├─ main/
  │  ├─ index.ts
  │  ├─ windows/
  │  │  └─ main.ts
  │  ├─ ipc/
  │  │  ├─ channels.ts               # Centralised channel names/types
  │  │  ├─ register.ts               # Register all ipcMain handlers
  │  │  ├─ user.ts                   # Auth/profile handlers (Supabase)
  │  │  ├─ game.ts                   # Blackjack session handlers
  │  │  ├─ heart.ts                  # Heart API fetch/validate handlers
  │  │  └─ telemetry.ts              # Optional analytics/log streams
  │  ├─ services/
  │  │  ├─ game-engine/
  │  │  │  ├─ blackjack-engine.ts    # Deterministic core game logic
  │  │  │  ├─ cards.ts               # Card/Deck entities, shuffling
  │  │  │  └─ rules.ts               # Rules, scoring, outcomes
  │  │  ├─ ai/
  │  │  │  ├─ strategies.ts          # Conservative/Aggressive/Random
  │  │  │  └─ ai-player.ts           # AI decision loop
  │  │  ├─ heart/
  │  │  │  └─ heart-service.ts       # Adapter for Heart API
  │  │  ├─ identity/
  │  │  │  └─ identity-service.ts    # Virtual identity orchestration
  │  │  └─ supabase/
  │  │     └─ client.ts              # Node/Electron Supabase client
  │  └─ state/
  │     └─ sessions.ts               # In-memory session tracking
  │
  ├─ preload/
  │  ├─ index.ts                     # ContextBridge: typed IPC facade (your requested API)
  │  └─ types.d.ts                   # Augment Window, expose ElectronHandler type
  │
  ├─ renderer/
  │  ├─ index.html
  │  ├─ index.tsx
  │  ├─ globals.css
  │  ├─ routes.tsx
  │  ├─ screens/
  │  │  ├─ main.tsx                  # Lobby/entry
  │  │  ├─ blackjack/
  │  │  │  ├─ table.tsx
  │  │  │  ├─ hand.tsx
  │  │  │  └─ controls.tsx
  │  │  ├─ heart/
  │  │  │  ├─ challenge.tsx          # Heart mini-game flow
  │  │  │  └─ puzzle-view.tsx
  │  │  └─ profile/
  │  │     ├─ profile.tsx
  │  │     └─ history.tsx
  │  ├─ components/
  │  │  └─ ui/
  │  │     └─ alert.tsx
  │  ├─ lib/
  │  │  ├─ supabase.ts               # Browser Supabase client
  │  │  ├─ event-bus.ts              # Renderer-side event emitter
  │  │  └─ store.ts                  # App state (Zustand/Redux)
  │  └─ adapters/
  │     ├─ game-adapter.ts           # IPC facade to main game services
  │     ├─ heart-adapter.ts          # IPC facade to heart service
  │     └─ user-adapter.ts           # IPC facade to user service
  │
  ├─ shared/
  │  ├─ constants.ts
  │  ├─ utils.ts
  │  ├─ types.ts                     # Cross-layer types (Card, Hand, Identity, etc.)
  │  └─ events/
  │     ├─ index.ts                  # Event payload types
  │     └─ schema.ts                 # Zod/io-ts schemas for payloads
  │
  ├─ lib/
  │  ├─ electron-app/
  │  │  ├─ factories/
  │  │  │  ├─ app/
  │  │  │  │  ├─ instance.ts
  │  │  │  │  └─ setup.ts
  │  │  │  ├─ ipcs/
  │  │  │  │  └─ register-window-creation.ts
  │  │  │  └─ windows/
  │  │  │     └─ create.ts
  │  │  └─ utils/
  │  │     └─ ignore-console-warnings.ts
  │  └─ electron-router-dom.ts
  │
  └─ resources/
     ├─ build/
     └─ public/