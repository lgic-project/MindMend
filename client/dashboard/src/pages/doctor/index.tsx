import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function Doctor() {
  const column = ['Name','Description','Phone','Working hour','working day','Experience','last_Created At','last_creaed By','Image', 'last_Updated At'];
 
  return (
    <>
      <Head>
        <title>Doctor - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Doctor" columnList={column}></Table>

      </Container>

    </>
  );
}


export default Doctor;
