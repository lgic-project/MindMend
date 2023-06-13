import {  Grid,  CardContent, Divider } from '@mui/material';
import React, {useRef } from 'react'
import { Modal,Button , Text, Radio, Input } from "@nextui-org/react";
import { useRouter } from 'next/router'


function CreateSiteConfig() {

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const router = useRouter();
  const { visible: queryVisible } = router.query;



  const closeHandler = () => {
    router.push(
      {
        pathname: '/additional/site-config',
      })
      setVisible(false);
  };




  const fileInputRef = useRef(null);




  return (
<div>

      <Modal
        closeButton
        blur
        width='50%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft:"5px"}}>
               New Site config
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
        <form >
        <CardContent>
        <Grid container spacing={5}>
            <Grid item xs={12}>


            </Grid>
            <Grid item xs={12} sm={6}>
            <Input
          bordered
          labelPlaceholder="Name" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Input
          bordered
          labelPlaceholder="Site key" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} sm={6} marginTop={5}>
            <Input
          bordered
          labelPlaceholder="Site value" width='100%'
          color="primary" />
            </Grid>


            <Grid item xs={12} sm={6} marginTop={1} paddingLeft={7}>
            <Radio.Group label="Status" defaultValue="1" orientation="horizontal">
      <Radio value="1" size="sm" isSquared>
        Active
      </Radio>
      <Radio value="0" size="sm" isSquared>
       Inactive
      </Radio>

    </Radio.Group>
            </Grid>



          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />


      </form>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={closeHandler}>
            Cancel
          </Button>
          <Button auto onPress={closeHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      </div>
  );
}

export default CreateSiteConfig;
