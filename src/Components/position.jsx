import React, { forwardRef } from "react";
import "./styles.css";
import { Box, Button, TextField, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export const Positions = (props) => {
  const { handleMove, refresh } = props;
  const [xInput, setXInput] = React.useState("");
  const [yInput, setYInput] = React.useState("");

  const handleClick = () => {
    handleMove(xInput, yInput, false, 0, true);
  };

  function clear() {
    setXInput("");
    setYInput("");
    refresh();
  }
  return (
    <Box
      className="spriteContainer"
      sx={{
        padding: "15px",
        flexGrow: 1,
        fontFamily: "monospace",
        height: "120px",
        background: "white",
        borderRadius: "20px",
      }}
    >
      <Typography
        variant="h11"
        sx={{ color: "#ed6c02", fontFamily: "monospace" }}
      >
        Note:
      </Typography>
      <span
        style={{ color: "grey", fontFamily: "monospace", fontSize: "10px" }}
      >
        Enter both x and y values
      </span>
      <Box
        style={{
          padding: "10px",
          display: "flex",
          flexDirection: "row",
          columnGap: "20px",
        }}
      >
        <TextField
          className
          id="outlined-name"
          label="x-cordniates"
          value={xInput}
          onChange={(e) => setXInput(e.target.value)}
          size="small"
          sx={{
            width: "150px",
          }}
        />
        <TextField
          id="outlined-name"
          label="y-cordniates"
          value={yInput}
          onChange={(e) => setYInput(e.target.value)}
          size="small"
          sx={{
            width: "150px",
          }}
        />
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleClick}
        >
          Move
        </Button>
        <RefreshIcon
          sx={{
            color: "black",
            height: "30px",
            marginTop: "2px",
            ":hover": { cursor: "pointer", color: "blue" },
          }}
          onClick={clear}
        />
      </Box>

      {/* </Box> */}
    </Box>
  );
};

export default Positions;
