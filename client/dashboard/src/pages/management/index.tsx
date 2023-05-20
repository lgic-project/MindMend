import Head from 'next/head';
import {  Container } from '@mui/material';

import Table from '../../views/dashboard/Table'


function ApplicationsTransactions() {
  return (
    <>
      <Head>
        <title>Transactions - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title= "management"></Table>

      </Container>

    </>
  );
}


export default ApplicationsTransactions;
