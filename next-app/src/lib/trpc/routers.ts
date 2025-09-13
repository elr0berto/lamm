import { z } from 'zod';
import { router, publicProcedure } from './index';

// Mock data for demonstration
let mockGames = [
  {
    id: 1,
    title: "Adventure Game",
    scenes: [
      { id: 1, name: "Forest", gameId: 1 },
      { id: 2, name: "Castle", gameId: 1 },
    ],
  },
  {
    id: 2,
    title: "Puzzle Game",
    scenes: [
      { id: 3, name: "Main Menu", gameId: 2 },
    ],
  },
];

let nextGameId = 3;
let nextSceneId = 4;

export const appRouter = router({
  // User procedures
  users: router({
    getAll: publicProcedure.query(async () => {
      return [
        { id: 1, email: "user1@example.com", username: "user1" },
        { id: 2, email: "user2@example.com", username: "user2" },
      ];
    }),
    
    create: publicProcedure
      .input(z.object({
        email: z.string().email(),
        username: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        return { id: 999, ...input };
      }),
  }),

  // Game procedures
  games: router({
    getAll: publicProcedure.query(async () => {
      return mockGames;
    }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const newGame = {
          id: nextGameId++,
          title: input.title,
          scenes: [],
        };
        mockGames.push(newGame);
        return newGame;
      }),
    
    getById: publicProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ input }) => {
        return mockGames.find(game => game.id === input.id) || null;
      }),
  }),

  // Scene procedures
  scenes: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        gameId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const newScene = {
          id: nextSceneId++,
          name: input.name,
          gameId: input.gameId,
        };
        
        // Add scene to the game
        const game = mockGames.find(g => g.id === input.gameId);
        if (game) {
          game.scenes.push(newScene);
        }
        
        return newScene;
      }),
  }),
});

export type AppRouter = typeof appRouter;