// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import { Tooltip,Button, Grid } from '@nextui-org/react';

import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import PageTitleWrapper from 'src/layouts/components/PageTitleWrapper'
import PageHeader from 'src/content/PageHeader'
import { ChangeEvent, useState } from 'react'
import TablePagination from '@mui/material/TablePagination'
import { BorderAllRounded, Padding } from '@mui/icons-material'
import { SizeXs } from 'mdi-material-ui'
import React from 'react'
import NextUILoadingComponent from 'src/layouts/components/loading'

interface RowType {
  id:number
  age: number
  name: string
  date: string
  email: string
  salary: string
  status: string
  designation: string
}

interface StatusObj {
  [key: string]: {
    color: ThemeColor
  }
}



const statusObj: StatusObj = {
  // applied: { color: 'info' },
  // rejected: { color: 'error' },
  // current: { color: 'primary' },
  InActive: { color: 'warning' },
  Active: { color: 'success' }
}

const DashboardTable = ({title, columnList, data, loading }) => {

  const [page, setPage] = useState<number>(0)


  if(columnList ==null){
    columnList = ['name','site']
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const renderCell = (column, value, index) => {
    if (column === 'status') {
      console.log(value);
      if (value =='1') {
        value ='Active'

      }
       if(value =='0'){
        value ='InActive'
       };

      return (
        <TableCell>
          <Chip
            label={value}
            color={statusObj[value].color}
            sx={{
              height: 24,
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
        </TableCell>
      );
    }
    if (column === 'id') {
      return (
        <TableCell key={column}>{index+1}</TableCell>
      );
    }

    return <TableCell>{value}</TableCell>;
  };




  return (
    <Card sx={{ width: '100%', overflow: 'hidden' }}>
       <PageTitleWrapper>
        <PageHeader title= {title} />



      </PageTitleWrapper>
      { loading ?(
        <NextUILoadingComponent />
      ):(
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              {columnList.map((item) => (


        <TableCell key={item}>{item}</TableCell>
      ))}
      {data.length === 0 ? (
        <p></p>
      ):(
        <TableCell>Action</TableCell>

      )}
            </TableRow>
          </TableHead>
          <TableBody>
          {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnList.length} style={{ textAlign: 'center' }} >No data available</TableCell>
          </TableRow>
        ) : (
            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover key={index} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>

                {columnList.map((column) => (
                 <React.Fragment key={column}>
                 {renderCell(column, row[column],index)}
               </React.Fragment>


))}
                <TableCell >
                <Grid.Container gap={1}  >
      <Grid  >
                <Tooltip  content="Edit" color="primary" style={{width: 40}}>
          <Button flat auto size={'xs'}>
            <ModeEditIcon fontSize='10' />
          </Button>
        </Tooltip>
        </ Grid>
        <Grid>
        <Tooltip content="Delete"  color="error">
          <Button flat auto color="error" size={'xs'}>
            <DeleteIcon fontSize='10' />
          </Button>
        </Tooltip>
        </Grid>
        </Grid.Container>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

    </Card>
  )
}

export default DashboardTable
