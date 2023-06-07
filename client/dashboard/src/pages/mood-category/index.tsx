import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function MoodCategory() {
  const column = ['Name','Logo','Created At', 'Updated At'];

  return (
    <>
      <Head>
        <title>Mood Category - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Mood Category" columnList={column} ></Table>

      </Container>

    </>
  );
}


export default MoodCategory;