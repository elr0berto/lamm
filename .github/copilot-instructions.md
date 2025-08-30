# LAMM - Phaser Game with User Management

LAMM is a Next.js application that integrates a Phaser.js game with React-based user management functionality. The application demonstrates how to combine modern web development with game development, featuring real-time game scenes, user creation, and interactive Phaser game controls.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Installation
- **CRITICAL**: Install PNPM package manager first:
  ```bash
  npm install -g pnpm@10.15.0
  ```
- Navigate to the project directory:
  ```bash
  cd next-app
  ```
- Install dependencies:
  ```bash
  pnpm install
  ```
  - Takes ~2-23 seconds depending on cache state. NEVER CANCEL.

### Build and Development Commands
- **Start development server**:
  ```bash
  pnpm dev
  ```
  - Starts in ~1 second. NEVER CANCEL.
  - Opens on http://localhost:3000
  - Uses Turbopack for fast development builds

- **Build for production**:
  ```bash
  pnpm build
  ```
  - Takes ~18-33 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
  - Uses Next.js with Turbopack for optimized production builds
  - Includes linting and type checking

- **Start production server**:
  ```bash
  pnpm start
  ```
  - Must run `pnpm build` first
  - Starts in ~600ms

- **Lint code**:
  ```bash
  pnpm lint
  ```
  - Takes ~2-4 seconds. NEVER CANCEL.
  - Uses ESLint with Next.js TypeScript configuration

### Database Setup (Optional - For Full Functionality)
The application works in two modes:
1. **Mock Mode** (Default): Uses hardcoded mock data for demonstration
2. **Database Mode**: Requires MySQL database and Prisma setup

For database mode:
- Create `.env` file with:
  ```
  PRISMA_DATABASE_URL="mysql://user:password@localhost:3306/lamm_db"
  PRISMA_SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/lamm_shadow_db"
  ```
- Generate Prisma client:
  ```bash
  pnpm prisma generate
  ```
- Run database migrations:
  ```bash
  pnpm prisma migrate dev
  ```

**NOTE**: In restricted network environments, Prisma engine downloads may fail. The application defaults to mock mode in this case.

## Validation and Testing

### Manual Validation Requirements
**CRITICAL**: After any changes to the application, ALWAYS perform these validation steps:

1. **Start the application**:
   ```bash
   pnpm dev
   ```

2. **Test user management functionality**:
   - Navigate to http://localhost:3000
   - Verify the page shows "Phaser Game with User Management"
   - Fill in email and username in the "Add New User" form
   - Click "Add User" button
   - Verify the form clears and no errors occur

3. **Test Phaser game functionality**:
   - Verify the game canvas displays with blue/green background
   - Verify "Main Menu" or game content is visible
   - Test "Change / Toggle Scene" button - should switch between game scenes
   - Test "Toggle Movement" button - should become disabled/enabled based on scene
   - Test "Add New Sprite" button - should add visual elements to the game
   - Test "Create Dynamic Scene" button - should create new game scenes

4. **Verify integration**:
   - Check that "Users count: X" displays correctly
   - Verify that game scenes update when user count changes

### Expected Behavior
- **Initial load**: Shows 2 mock users, Phaser game with Main Menu scene
- **User creation**: Form submits successfully, mock user is created
- **Game interaction**: All buttons respond, scenes change, sprites are interactive
- **Performance**: Page loads in <5 seconds, interactions are responsive

## Technology Stack Details

### Core Technologies
- **Next.js 15.5.0**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript 5.x**: Type safety
- **Phaser.js 3.90.0**: Game engine
- **Prisma 6.14.0**: Database ORM (MySQL)
- **PNPM 10.15.0**: Package manager

### Project Structure
```
next-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── lib/
│   │   ├── actions/           # Server actions
│   │   │   └── userActions.ts # User CRUD operations
│   │   ├── ui/                # React components
│   │   │   ├── GameWithUsers.tsx    # Main app component
│   │   │   ├── PhaserWrapper.tsx    # Phaser integration
│   │   │   ├── GameWrapper.tsx      # Game container
│   │   │   └── scenes/              # Phaser game scenes
│   │   │       ├── Boot.ts
│   │   │       ├── MainMenu.ts
│   │   │       ├── Game.ts
│   │   │       └── GameOver.ts
│   │   ├── util/              # Utilities
│   │   │   └── EventBus.ts    # Event communication
│   │   └── prisma.ts          # Database client
│   └── prisma/                # Database schema
│       └── schema.prisma      # Prisma schema definition
├── public/
│   └── assets/                # Game assets
│       ├── bg.png            # Background image
│       ├── logo.png          # Phaser logo
│       └── star.png          # Sprite asset
├── package.json              # Dependencies and scripts
├── next.config.ts            # Next.js configuration
├── prisma.config.ts          # Prisma configuration
└── tsconfig.json             # TypeScript configuration
```

### Key Components
- **GameWithUsers**: Main React component that combines user management and game
- **PhaserWrapper**: Integrates Phaser.js game with React
- **EventBus**: Enables communication between React and Phaser
- **User Actions**: Server-side functions for user management
- **Phaser Scenes**: Boot → Preloader → MainMenu → Game → GameOver

## Common Issues and Solutions

### Network Restrictions
- **Google Fonts**: Application falls back to system fonts if external fonts fail
- **Prisma Engines**: Application uses mock data if Prisma setup fails
- **Build failures**: Check network connectivity for external dependencies

### Development Workflow
1. Always run `pnpm install` after pulling changes
2. Always run `pnpm lint` before committing changes
3. Test both development (`pnpm dev`) and production (`pnpm build && pnpm start`) modes
4. Verify game functionality manually after any changes to Phaser components

### Performance Expectations
- **Dependency installation**: 2-23 seconds
- **Development server startup**: <1 second
- **Production build**: 18-33 seconds
- **Linting**: 2-4 seconds
- **Page load time**: <5 seconds
- **Game initialization**: <2 seconds

## Timeout Guidelines
**CRITICAL**: Always use these timeout values to prevent premature command cancellation:

- `pnpm install`: 600 seconds (10 minutes)
- `pnpm build`: 3600 seconds (60 minutes) - NEVER CANCEL
- `pnpm dev`: No timeout needed (starts quickly)
- `pnpm lint`: 300 seconds (5 minutes)
- `pnpm start`: 60 seconds

## Validation Checklist
Before considering any changes complete, verify:

- [ ] `pnpm install` completes successfully
- [ ] `pnpm lint` passes (warnings acceptable, errors must be fixed)
- [ ] `pnpm build` completes successfully
- [ ] `pnpm dev` starts and serves the application
- [ ] Application loads at http://localhost:3000
- [ ] User management form is functional
- [ ] Phaser game displays and is interactive
- [ ] All game control buttons respond appropriately
- [ ] No console errors in browser developer tools
- [ ] Game scenes can be switched successfully
- [ ] User count displays correctly in both UI and game

## Repository Context
This repository contains only the `next-app/` directory with the actual application code. The root directory serves as a simple container. All development work should be done within the `next-app/` directory.