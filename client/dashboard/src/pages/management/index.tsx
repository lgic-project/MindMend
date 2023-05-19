import Head from 'next/head';
import { Grid, Container, Card } from '@mui/material';

import Table from '../../views/dashboard/Table'
import PageTitleWrapper from 'src/layouts/components/PageTitleWrapper'
import PageHeader from 'src/content/PageHeader'
import { Box } from 'mdi-material-ui'

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
