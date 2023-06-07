import Head from 'next/head';
import {  Container } from '@mui/material';

import Table from '../../views/dashboard/Table'


function ApplicationsTransactions() {
  const column = ['Name','Logo','Created At', 'Updated At'];

  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title= "management" columnList={column}></Table>

      </Container>

    </>
  );
}


export default ApplicationsTransactions;
