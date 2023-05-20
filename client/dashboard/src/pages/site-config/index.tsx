import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function SiteConfig() {
  return (
    <>
      <Head>
        <title>SiteConfig - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="SiteConfig"></Table>

      </Container>

    </>
  );
}


export default SiteConfig;
