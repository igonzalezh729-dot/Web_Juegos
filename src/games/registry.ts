import { gameManager } from '@/server/game-manager';
import { quickTapHandler } from './quick-tap';

export function registerGames(): void {
  gameManager.registerGame(quickTapHandler);
  console.log(`[Games] Registered ${gameManager.getAvailableGames().length} games`);
}
