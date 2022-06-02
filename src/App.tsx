import { Chess, Square, ChessInstance, Move } from "chess.js";
import Chessboard from "chessboardjsx";
import { useState } from "react";

const pieceValue = {
  p: 10, // pawn
  n: 30, // knight
  b: 30, // bishop
  r: 50, // rook
  q: 90, // queen
  k: 900, // king
};

const App = () => {
  const [game] = useState<ChessInstance>(() => new Chess());
  const [fen, setFen] = useState("start");
  const [squareStyles, setSquareStyles] =
    useState<Chessboard["props"]["squareStyles"]>();
  const [history, setHistory] = useState<Move[]>([]);

  const ai = () => {
    const possibleMoves = game.moves();
    let bestValue = -Infinity;
    let bestMove = -1;

    // game over
    if (possibleMoves.length === 0) return;

    possibleMoves.forEach((_, i) => {
      game.move(possibleMoves[i]);

      const boardValue = -getBoardValue();
      game.undo();

      if (boardValue > bestValue) {
        bestValue = boardValue;
        bestMove = i;
      }
    });

    game.move(possibleMoves[bestMove]);
    setFen(game.fen());
  };

  const getBoardValue = () => {
    let totalValue = 0;
    const board = game.board();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece) {
          totalValue += pieceValue[piece.type];
        }
      }
    }
    return totalValue;
  };

  // show possible moves
  const highlightSquare = (
    sourceSquare: Square,
    squaresToHighlight: Square[]
  ) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background: "#fffc0030",
            },
          },
          ...squareStyling(history),
        };
      },
      {}
    );

    setSquareStyles((prev) => ({ ...prev, ...highlightStyles }));
  };

  const removeHighlightSquare = () => {
    setSquareStyles(squareStyling(history));
  };

  const onDrop = ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: Square;
    targetSquare: Square;
  }) => {
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    setFen(game.fen());
    setHistory(game.history({ verbose: true }));
    setSquareStyles(squareStyling(history));

    setTimeout(ai, 250);
  };

  const onMouseOverSquare = (square: Square) => {
    // get list of possible moves for this square
    let moves = game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight: Square[] = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    highlightSquare(square, squaresToHighlight);
  };

  const onMouseOutSquare = () => removeHighlightSquare();

  return (
    <Chessboard
      id="chess-ai"
      width={800}
      position={fen}
      onDrop={onDrop}
      onMouseOverSquare={onMouseOverSquare}
      onMouseOutSquare={onMouseOutSquare}
      boardStyle={{
        borderRadius: "5px",
      }}
      squareStyles={squareStyles}
    />
  );
};

export default App;

const squareStyling = (history: any) => {
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)",
      },
    }),
  };
};
