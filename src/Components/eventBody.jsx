import * as React from "react";
import { SingleAction } from "./singleAction";
import { Droppable } from "react-beautiful-dnd";
import { Box, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sprites } from "./spriteProps";

import Draggable1 from "react-draggable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WARN_MSG_POS, WARN_MSG_SIZE } from "../constants";

// Import your sprite images
import CatSprite from "../Assets/images/cat2.svg";
import Positions from "./position";
import { yellow } from "@mui/material/colors";

export const EventBody = (props) => {
  const { moves, setMoves, actions, setActions, setActions2, actions2 } = props;

  const [sprites, setSprites] = React.useState([CatSprite]);
  const [refs, setRefs] = React.useState([React.createRef()]);
  const [displayAddIcon, setDisplayAddIcon] = React.useState(true);

  // Position and transformation variables
  const [positions, setPositions] = React.useState([
    { x: -100, y: 0, scale: 1, angle: 0 },
  ]);

  const [sprite, setSprite] = React.useState(CatSprite);

  // Function to check for collision
  const checkCollision = (index1, index2) => {
    const sprite1Rect = refs[index1].current.getBoundingClientRect();
    const sprite2Rect = refs[index2].current.getBoundingClientRect();

    return !(
      sprite1Rect.right < sprite2Rect.left ||
      sprite1Rect.left > sprite2Rect.right ||
      sprite1Rect.bottom < sprite2Rect.top ||
      sprite1Rect.top > sprite2Rect.bottom
    );
  };

  // Function to swap actions when collision occurs
  const handleCollision = (index1, index2) => {
    if (checkCollision(index1, index2)) {
      // Swap actions
      const tempActions = [...actions];
      setActions([...actions2]);
      setActions2(tempActions);

      // Show a toast notification (optional)
      toast.info("Sprites collided! Swapping actions.", {
        position: "top-center",
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Function to transform sprites
  function transform(index, x, y) {
    const newPositions = [...positions];
    newPositions[index] = { ...newPositions[index], x, y };
    setPositions(newPositions);

    refs[index].current.style.transform = `translate(${x}px, ${y}px) scale(${newPositions[index].scale}) rotate(${newPositions[index].angle}deg)`;

    // Check for collision after movement
    if (!displayAddIcon && refs[index].current && refs.length > 1) {
      for (let i = 0; i < refs.length; i++) {
        if (i !== index) {
          handleCollision(index, i);
        }
      }
    }
  }

  // Movement functions
  function moveRight(index, i) {
    setTimeout(() => {
      const newX = positions[index].x + 10;
      if (newX > 580) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(index, newX, positions[index].y);
    }, i * 1500);
  }

  function moveLeft(index, i) {
    setTimeout(() => {
      const newX = positions[index].x - 10;
      if (newX < -580) {
        refresh(WARN_MSG_POS);
        return;
      }
      transform(index, newX, positions[index].y);
    }, i * 1500);
  }

  function rotateSprite(index, rAngle, i) {
    setTimeout(() => {
      const newAngle = positions[index].angle + rAngle;
      const newPositions = [...positions];
      newPositions[index] = { ...newPositions[index], angle: newAngle };
      setPositions(newPositions);
      transform(index, positions[index].x, positions[index].y);
    }, i * 1500);
  }

  function moveXY(index, xInput, yInput, random, i) {
    const newX = random
      ? Math.floor(Math.random() * (-290 - 290) + 290)
      : parseInt(xInput);
    const newY = random
      ? Math.floor(Math.random() * (-140 - 140) + 140)
      : parseInt(yInput);

    if (newX < -290 || newX > 290 || newY < -140 || newY > 140) {
      refresh(WARN_MSG_POS);
      return;
    }

    transform(index, newX, newY);
  }

  // Clear all timeouts
  function clearTimeouts() {
    var highestTimeoutId = setTimeout(";");
    for (var i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  // Refresh function to reset positions
  const refresh = (msg) => {
    setPositions([{ x: -100, y: 0, scale: 1, angle: 0 }]);
    clearTimeouts();

    if (msg) {
      toast.warn(msg, {
        position: "top-center",
        autoClose: 2000,
        borderRadius: "20px",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    refs.forEach((ref) => {
      ref.current.style.transform = `translate(${positions[0].x}px, ${positions[0].y}px) scale(${positions[0].scale}) rotate(${positions[0].angle}deg)`;
    });
  };

  // Run actions for sprites
  function runAction(index) {
    actions &&
      actions.forEach((item, i) => {
        console.log(item);
        switch (item.todo) {
          case "move x by 10":
            moveRight(index, i);
            break;
          case "move x by -10":
            moveLeft(index, i);
            break;
          case "turn 20":
            rotateSprite(index, 20, i);
            break;
          case "random position":
            moveXY(index, 1, 1, true, i);
            break;
          case "repeat":
            setTimeout(() => {
              runAction(index);
            }, i * 1500);
            break;
          default:
            break;
        }
      });
  }

  return (
    <div className="mainContainer">
      <ToastContainer />
      <div className="container">
        <Droppable droppableId="MovesList">
          {(provided) => (
            <div
              className="moves"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="moves__heading">Moves</div>
              {moves?.map((move, index) => (
                <SingleAction
                  disableDelete={true}
                  index={index}
                  moves={moves}
                  move={move}
                  key={move.id}
                  setMoves={setMoves}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="MovesActions">
          {(provided) => (
            <div
              className="moves actions"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <span className="moves__heading">Action</span>
              {actions?.map((move, index) => (
                <SingleAction
                  index={index}
                  moves={actions}
                  move={move}
                  key={move.id}
                  refresh={refresh}
                  setMoves={setActions}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {displayAddIcon && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="icon">
              <AddBoxIcon
                sx={{ color: "gray", cursor: "pointer" }}
                onClick={() => {
                  setDisplayAddIcon(false);
                  const newX = positions[positions.length - 1].x + 50;
                  const newY = positions[positions.length - 1].y;
                  setSprites([...sprites, CatSprite]);
                  setRefs([...refs, React.createRef()]);
                  setPositions([
                    ...positions,
                    { x: newX, y: newY, scale: 1, angle: 0 },
                  ]);
                }}
              />
              <span className="tooltiptext">add sprite</span>
            </div>
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
 }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}
        {!displayAddIcon && (
          <Droppable droppableId="MovesActions2">
            {(provided) => (
              <div
                className="moves actions"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <span className="moves__heading">Action 2</span>
                {actions2?.map((move, index) => (
                  <SingleAction
                    index={index}
                    moves={actions2}
                    move={move}
                    key={move.id}
                    refresh={refresh}
                    setMoves={setActions2}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        {!displayAddIcon && (
          <div className="icon">
            <AddBoxIcon
              sx={{ color: "gray", cursor: "pointer" }}
              onClick={() => {
                const newX = positions[positions.length - 1].x + 50;
                const newY = positions[positions.length - 1].y;
                setSprites([...sprites, CatSprite]);
                setRefs([...refs, React.createRef()]);
                setPositions([
                  ...positions,
                  { x: newX, y: newY, scale: 1, angle: 0 },
                ]);
              }}
            />
            <div>
              <DeleteIcon
                onClick={() => {
                  setActions([]);
                  setActions2([]);
                }}
                sx={{ cursor: "pointer", fontSize: "30px", color: "Grey" }}
              />
            </div>
          </div>
        )}
        <div className="moves play" style={{}}>
          {sprites.map((sprite, index) => (
            <Draggable1
              bounds={{ left: -800, top: -400, right: 800, bottom: 400 }}
              key={index}
            >
              <div
                ref={refs[index]}
                style={{
                  position: "relative",
                  transition: "1s all ease",
                }}
              >
                <img
                  src={sprite}
                  draggable="false"
                  alt="sprite"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    height: "auto", // Adjust to maintain aspect ratio
                    width: "auto", // Adjust to maintain aspect ratio
                    maxHeight: "100px", // Set the maximum size based on your container
                    maxWidth: "100px", // Set the maximum size based on your container
                    objectFit: "contain", // Ensures the image fits within the outline
                    transition: "1s all ease",
                  }}
                />
              </div>
            </Draggable1>
          ))}
        </div>
      </div>

      <div className="gameProps">
        <Sprites
          setSprite={setSprite}
          displayAddIcon={displayAddIcon}
          sprite={sprite}
        />

        <div className="playRefresh">
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              marginRight: "5px",
              height: "40px",
              width: "80px",
            }}
            color="success"
            onClick={() => {
              sprites.forEach((_, index) => {
                runAction(index);
              });
            }}
          >
            <PlayArrowIcon />
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px", height: "40px", width: "80px" }}
            color="error"
            onClick={refresh}
          >
            <RefreshIcon sx={{ color: "white" }} />
          </Button>
        </div>
        <Positions handleMove={moveXY} refresh={refresh} />
      </div>
    </div>
  );
};

export default EventBody;