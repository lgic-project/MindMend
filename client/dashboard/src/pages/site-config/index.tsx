import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function SiteConfig() {
  const column = ['Name','Logo','Created At', 'Updated At'];

  return (
    <>
      <Head>
        <title>SiteConfig - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="SiteConfig" columnList={column}></Table>

      </Container>

    </>
  );
}


export default SiteConfig;
