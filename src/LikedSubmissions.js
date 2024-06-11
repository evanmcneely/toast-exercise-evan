import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";

const columns = [
  { field: "id", headerName: "ID", width: 400 },
  { field: "firstName", headerName: "First name", width: 150 },
  { field: "lastName", headerName: "Last name", width: 150 },
  { field: "email", headerName: "Email Address", width: 200 },
];

export default function LikedSubmissions({ likedSubmissions }) {
  const rows = likedSubmissions.data.reverse().map((submission) => {
    return {
      id: submission.id,
      firstName: submission.data.firstName,
      lastName: submission.data.lastName,
      email: submission.data.email,
    };
  });

  return (
    <div style={{ height: 650, width: "100%" }}>
      <Typography variant="h4">Liked Form Submissions</Typography>
      <DataGrid
        sx={{ mt: 5 }}
        rows={rows}
        columns={columns}
        pageSize={10}
        loading={likedSubmissions.loading}
        error={likedSubmissions.error}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
}
