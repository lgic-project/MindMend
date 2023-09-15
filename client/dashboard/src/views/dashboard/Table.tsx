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
import { Tooltip, Button, Grid, Popover } from '@nextui-org/react'

import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'

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
import { Delete } from 'src/content/Delete'

interface RowType {
  id: number
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
  Null: { color: 'info' },
  Deleted: { color: 'error' },
  // current: { color: 'primary' },
  InActive: { color: 'warning' },
  Active: { color: 'success' }
}

const DashboardTable = ({ title, columnList, data, loading, create }) => {

  const [page, setPage] = useState<number>(0)





  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const [rowsPerPage, setRowsPerPage] = useState<number>(10)


  const renderColumn = (item) => {
    if (item === 'image' || item === 'logo' || item === 'video' || item === 'photo' || item === 'resource' || item === 'animation') {
      return <p></p>

    }
    if (item === 'api') {
      return (
        <React.Fragment>
          <TableCell key="apiPath">Api Path</TableCell>
          <TableCell key="method">Method</TableCell>
        </React.Fragment>

      )

    }

    return <TableCell key={item}>{item}</TableCell>


  }

  const renderCell = (column, value, index) => {


    if (column === 'status') {
      if (value == '1') {
        value = 'Active'

      }
      if (value == '0') {
        value = 'InActive'
      };
      if (value == '2') {
        value = 'Deleted'
      };
      if (value == null) {
        value = 'Null'
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
      )
    }
    if (column === 'encodedImage') {
      if (value === null || value === '') {
        return (
          <TableCell key="image">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <ImgStyled src='data:image/png;base64,${imgSrc}' alt='Profile Pic' /> */}
              <img width={100}
                src='' alt="image" />
            </Box>
          </TableCell>
        )
      }
      else {
        const base64String = value // Base64 encoded string
        const regularString = convertBase64ToString(base64String)

        return (
          <TableCell key="image">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* <ImgStyled src='data:image/png;base64,${imgSrc}' alt='Profile Pic' /> */}
              <img width={100}
                src={regularString} alt="image" />
            </Box>
          </TableCell>
        )
      }

    }
    if (column === 'id') {
      return (
        <TableCell key={column}>{index + 1}</TableCell>
      )
    }
    if (column === 'api') {

      return (
        <React.Fragment>

          <TableCell key="apiPath">{value.apiPath}</TableCell>
          <TableCell key="method">{value.method}</TableCell>

        </React.Fragment>


      )
    }

    if (column === 'method') {
      return (

        <TableCell key="method">{apiMethod}</TableCell>


      )
    }
    if (column === 'image' || column === 'logo' || column === 'photo' || column === 'video' || column === 'resource' || column === 'animation') {
      return (
        <p></p>
      )
    }
    if (column === 'description') {
      return (

        <TableCell className="truncate" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{value}</TableCell>


      )
    }

    return <TableCell>{value}</TableCell>
  }




  return (
    <Card sx={{ width: '100%', overflow: 'hidden' }}>
      <PageTitleWrapper>
        <PageHeader title={title} link={create} />



      </PageTitleWrapper>
      {loading ? (
        <NextUILoadingComponent />
      ) : (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader sx={{ minWidth: 800 }} aria-label='table in dashboard'>
            <TableHead>
              <TableRow>
                {columnList.map((item) => (
                  <React.Fragment key={item}>
                    {renderColumn(item)}
                  </React.Fragment>
                ))}
                {data.length === 0 ? (
                  <p></p>
                ) : (
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
                        {renderCell(column, row[column], index)}
                      </React.Fragment>


                    ))}
                    <TableCell >
                      <Grid.Container gap={1}  >
                        <Grid  >
                          <Tooltip content="Edit" color="primary" style={{ width: 40 }}>
                            <Button flat auto size={'xs'}>
                              <ModeEditIcon fontSize='10' />
                            </Button>
                          </Tooltip>
                        </ Grid>
                        <Grid>
                          <Tooltip content="Delete" color="error">
                            <Popover>
                              <Popover.Trigger>
                                <Button flat auto color="error" size={'xs'}>
                                  <DeleteIcon fontSize='10' />
                                </Button>
                              </Popover.Trigger>
                              <Popover.Content css={{ marginRight: "100px" }}>
                                <Delete />
                              </Popover.Content>
                            </Popover>

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
function convertBase64ToString(base64) {
  return atob(base64)
}

