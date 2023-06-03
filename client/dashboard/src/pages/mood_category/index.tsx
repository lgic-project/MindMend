import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function Moodcategory() {
  return (
    <>
      <Head>
        <title>Moodcategory - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Mood Category"></Table>

      </Container>

    </>
  );
}


export default Moodcategory;
