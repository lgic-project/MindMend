import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function Contact() {
  return (
    <>
      <Head>
        <title>Contact - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Contact"></Table>

      </Container>

    </>
  );
}


export default Contact;
