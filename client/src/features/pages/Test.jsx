import { TextField } from "@mui/material";
import React, { useState } from "react";

const Test = () => {
  const [text, setText] = useState("initial text");
  return (
    <div className="p-10">
      <TextField value={text} onChange={(e) => setText(e.target.value)} />

      <TextField
        id="standard-basic"
        label="Address"
        name="address"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="new-password"
        type="text"
        fullWidth
        variant="outlined"
        // size="small"
        sx={{
            marginTop:"20px",
          ".MuiInputBase-root": {
            borderRadius: "25px",
            width: "100%",
          },
        }}
      />
    </div>
  );
};

export default Test;
