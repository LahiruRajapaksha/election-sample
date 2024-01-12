import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

function createData(name: string) {
  return {
    name,
  };
}
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "candidateName", headerName: "Candidate Name", width: 130 },
  { field: "constituency", headerName: "Constituency", width: 130 },
  {
    field: "votes",
    headerName: "No. of Votes",
    type: "number",
    width: 90,
  },
];

const dataGridRows = [
  { id: 1, candidateName: "Snow", constituency: "Jon", votes: 35 },
  { id: 2, candidateName: "Lannister", constituency: "Cersei", votes: 42 },
  { id: 3, candidateName: "Lannister", constituency: "Jaime", votes: 45 },
  { id: 4, candidateName: "Stark", constituency: "Arya", votes: 16 },
  { id: 5, candidateName: "Targaryen", constituency: "Daenerys", votes: null },
  { id: 6, candidateName: "Melisandre", constituency: null, votes: 150 },
  { id: 7, candidateName: "Clifford", constituency: "Ferrara", votes: 44 },
  { id: 8, candidateName: "Frances", constituency: "Rossini", votes: 36 },
  { id: 9, candidateName: "Roxie", constituency: "Harvey", votes: 65 },
];

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Typography variant="h6" sx={{ pl: 2 }}>
              {row.name}
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ height: "100%" }}
          >
            <Box sx={{ mt: 2, mb: 2 }}>
              <DataGrid
                rows={dataGridRows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData("Shangri-la-Town"),
  createData("Northern-Kunlun-Mountain"),
  createData("Western-Shangri-La"),
  createData("Naboo-Vallery"),
  createData("New-Felucia"),
];

export default function CollapsibleTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
