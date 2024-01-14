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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ConstituencyResult } from "../utills/datahandling";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Candidate Name", width: 130 },
  { field: "party", headerName: "Party", width: 130 },
  {
    field: "vote",
    headerName: "No. of Votes",
    type: "number",
    width: 90,
  },
];

const Row = (props: ConstituencyResult) => {
  const { constituency, results } = props;
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
              {constituency}
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
                rows={results}
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
};

type CollapseTableProps = {
  tableData: ConstituencyResult[];
};

export default function CollapsibleTable(props: CollapseTableProps) {
  const { tableData } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableBody>
          {tableData.map((row, index) => (
            <Row
              key={index}
              constituency={row.constituency}
              results={row.results}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
