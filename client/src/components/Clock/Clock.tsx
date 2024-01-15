import { Box, Typography } from "@mui/material";
import { useState } from "react";

const Clock = () => {
  let time = new Date().toLocaleTimeString();
  const [ctime, setTime] = useState(time);
  const UpdateTime = () => {
    time = new Date().toLocaleTimeString();
    setTime(time);
  };
  setInterval(UpdateTime);
  return (
    <Box sx={{ p: 2, border: 2, my: 2, borderRadius: 1 }}>
      <Typography variant="h2" sx={{ fontFamily: "sans-serif" }}>
        {ctime}
      </Typography>
    </Box>
  );
};

export default Clock;
