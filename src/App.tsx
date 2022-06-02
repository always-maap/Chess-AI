import { Chess, Square } from "chess.js";

import Chessboard from "chessboardjsx";
import { CSSProperties, useEffect, useState } from "react";

const HumanVsHuman = () => {
  const [game, setGame] = useState<any>();
  const [fen, setFen] = useState("start");
  const [squareStyles, setSquareStyles] =
    useState<{ [square in Square]?: CSSProperties }>();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setGame(new Chess());
  }, []);

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

export default HumanVsHuman;

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
