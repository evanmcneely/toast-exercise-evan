import React from "react";
import Box from "@mui/material/Box";
import LikedSubmissions from "./LikedSubmissions";

export default function Content({ likedSubmissions }) {
  return (
    <Box sx={{ marginTop: 3 }}>
      <LikedSubmissions likedSubmissions={likedSubmissions} />
    </Box>
  );
}
