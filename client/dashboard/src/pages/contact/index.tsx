import Head from 'next/head';
import { Container } from '@mui/material';

import Table from '../../views/dashboard/Table'

function Contact() {
  const column = ['Name','Email','Created At', 'Updated At','Updated By'];

  return (
    <>
      <Head>
        <title>Contact - Applications</title>
      </Head>

      <Container maxWidth="lg">

          <Table title ="Contact" columnList={column}></Table>

      </Container>

    </>
  );
}


export default Contact;
