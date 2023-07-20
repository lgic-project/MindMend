import * as React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

const VISIBLE_FIELDS: string[] = ['name', 'rating', 'country', 'dateCreated', 'isAdmin']

interface RowData {
  id: number
  name: string
  rating: number
  country: string
  dateCreated: string
  isAdmin: boolean
}

const data: RowData[] = [
  {
    id: 1,
    name: 'John Doe',
    rating: 4,
    country: 'USA',
    dateCreated: '2022-01-01',
    isAdmin: false,
  },
  {
    id: 2,
    name: 'simran baniya',
    rating: 4,
    country: 'USA',
    dateCreated: '2022-01-01',
    isAdmin: false,
  },
  // Add more data rows here...
]

export default function QuickFilteringCardList(): JSX.Element {
  const [filterText, setFilterText] = React.useState('')

  const filteredData = React.useMemo(() => {
    if (!filterText) {
      return data
    }

    return data.filter((row: RowData) =>
      VISIBLE_FIELDS.some((field) =>
        String(row[field]).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [filterText])

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Filter"
        variant="outlined"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Grid container spacing={2}>
        {filteredData.map((row: RowData) => (
          <Grid item xs={12} sm={6} md={4} key={row.id}>
            <Card>
              <CardContent>
                <div>Name: {row.name}</div>
                <div>Rating: {row.rating}</div>
                <div>Country: {row.country}</div>
                <div>Date Created: {row.dateCreated}</div>
                <div>Is Admin: {row.isAdmin ? 'Yes' : 'No'}</div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
