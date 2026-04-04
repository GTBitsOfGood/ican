/**
 * Probability of using minimax for each difficulty level
 */
export const TICTACTOE_MINIMAX_PROBABILITY = {
  easy: 0.25, // 25% minimax, 75% random
  normal: 0.75, // 75% minimax, 25% random
  expert: 1.0, // 100% minimax
} as const;
