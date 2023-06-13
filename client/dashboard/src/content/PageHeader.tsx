import { Typography,Button as Button1, Grid, Link } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import React from 'react'
import { Modal, Input, Row, Checkbox,Button , Text } from "@nextui-org/react";
import { useRouter } from 'next/router'

function PageHeader( { title, link }) {

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const router = useRouter();
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };

  const handleButtonClick = () => {
    router.push(
    {
      pathname: link,
      query: { visible: 'true'}, // Example props
    })
  };


  return (
    <Grid container justifyContent="space-between"  paddingY={10} alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1">
          {user.name}, these are your recent {title}
        </Typography>
      </Grid>
      <Grid item>

        <Button auto shadow onPress={handler} onClick={handleButtonClick}
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"

        >
          Create {title}
        </Button>


      </Grid>

      {/* <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Welcome to
            <Text b size={18}>
              NextUI
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Email"

          />
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"

          />
          <Row justify="space-between">
            <Checkbox>
              <Text size={14}>Remember me</Text>
            </Checkbox>
            <Text size={14}>Forgot password?</Text>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Close
          </Button>
          <Button auto onPress={closeHandler}>
            Sign in
          </Button>
        </Modal.Footer>
      </Modal> */}

    </Grid>
  );
}

export default PageHeader;
