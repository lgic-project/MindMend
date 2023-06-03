import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function User() {
  return (
    <>
      <Head>
        <title>User - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="User"></Table>

      </Container>

    </>
  );
}


export default User;
