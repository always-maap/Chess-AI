import { ChessInstance } from 'chess.js';
import { pieceValue } from './pieceValue';

export const getBoardValue = (board: ReturnType<ChessInstance['board']>) => {
  let totalValue = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        totalValue += piece.color === 'w' ? pieceValue[piece.type] : -pieceValue[piece.type];
      }
    }
  }
  return totalValue;
};
