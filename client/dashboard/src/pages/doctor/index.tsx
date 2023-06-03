import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function Doctor() {
  return (
    <>
      <Head>
        <title>Doctor - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Doctor"></Table>

      </Container>

    </>
  );
}


export default Doctor;
