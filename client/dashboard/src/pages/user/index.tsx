import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function User() {
  const column = ['Name','Email','Updated By','Created At','Updated At'];

  return (
    <>
      <Head>
        <title>User - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="User" columnList={column}></Table>

      </Container>

    </>
  );
}


export default User;
