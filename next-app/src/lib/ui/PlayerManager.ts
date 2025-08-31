import { EventBus } from '@/lib/util/EventBus';

export type PlayerSide = 'left' | 'right';
export interface PlayerData {
  id: 'player1' | 'player2';
  texture: string;
  tint: number;
  side: PlayerSide;
  x: number;
  y: number;
}

/**
 * Central authority for player logical state (position, side, cosmetics).
 * Scenes subscribe to arrival/departure events and render/destroy display objects locally.
 */
export class PlayerManager {
  private static _instance: PlayerManager;
  static get instance(): PlayerManager {
    if (!this._instance) this._instance = new PlayerManager();
    return this._instance;
  }

  private players: Record<string, PlayerData> = {};
  private initialized = false;

  /** Initialize default player states (idempotent). */
  init(width: number, height: number) {
    if (this.initialized) return;
    const halfWidth = width / 2;
    const centerY = height / 2;
    this.players.player1 = {
      id: 'player1',
      texture: 'star',
      tint: 0xffdd55,
      side: 'left',
      x: halfWidth / 2 - 100,
      y: centerY
    };
    this.players.player2 = {
      id: 'player2',
      texture: 'logo',
      tint: 0x55ddff,
      side: 'left',
      x: halfWidth / 2 + 100,
      y: centerY
    };
    this.initialized = true;
  }

  getPlayersForSide(side: PlayerSide): PlayerData[] {
    return Object.values(this.players).filter(p => p.side === side);
  }

  getPlayer(id: 'player1' | 'player2'): PlayerData | undefined {
    return this.players[id];
  }

  /** Update position (called by owning scene). */
  updatePosition(id: 'player1' | 'player2', x: number, y: number) {
    const p = this.players[id];
    if (!p) return;
    p.x = x; p.y = y;
  }

  /** Transfer player to the opposite side, computing spawn point for arrival. */
  transferPlayer(id: 'player1' | 'player2', gameWidth: number, gameHeight: number) {
    const p = this.players[id];
    if (!p) return;
    const fromSide = p.side;
    const toSide: PlayerSide = fromSide === 'left' ? 'right' : 'left';
    const halfWidth = gameWidth / 2;
    const centerY = gameHeight / 2;

    const spawnY = centerY + (id === 'player1' ? -60 : 60);
    // Symmetric spawn: appear just inside the door area of target side.
    // Left side door is at right edge => spawnX = halfWidth - 80. Right side door at left edge => spawnX = 80.
    const spawnX = toSide === 'left' ? halfWidth - 80 : 80;

    // Emit depart BEFORE changing side so source scene can clean up.
    EventBus.emit('player-depart', { id, side: fromSide });

    p.side = toSide;
    p.x = spawnX;
    p.y = spawnY;

    EventBus.emit('player-arrive', { ...p });
  }
}

export const playerManager = PlayerManager.instance;
