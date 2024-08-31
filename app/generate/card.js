import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";

const FlipCardContainer = styled("div")(({ isFlipped }) => ({
  height: "200px",
  "& .inner": {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    transition: "transform 0.6s",
  },
  "& .front, & .back": {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  "& .back": {
    transform: "rotateY(180deg)",
  },
}));

const FlipCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <FlipCardContainer isFlipped={isFlipped} onClick={handleFlip}>
      <div className="inner">
        <Card className="front">
          <CardContent>
            <Typography variant="h5" component="div">
              {front}
            </Typography>
          </CardContent>
        </Card>
        <Card className="back">
          <CardContent>
            <Typography variant="h5" component="div">
              {back}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </FlipCardContainer>
  );
};

export default FlipCard;
