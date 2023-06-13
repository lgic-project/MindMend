import { Button as Button1, Grid, FormControl, InputLabel, TextField, CardActions, CardContent, Divider, ButtonProps, Typography, styled, IconButton } from '@mui/material';
import React, { ChangeEvent, ElementType, useRef, useState } from 'react'
import { Modal,Button , Text, Radio, Textarea, Input } from "@nextui-org/react";
import { useRouter } from 'next/router'
import { Select, MenuItem } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material'



function CreateDiscover() {

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const [selectedValue, setSelectedValue] = useState('option1');
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [base64, setBase64] = useState<string | null>(null);


  const router = useRouter();
  const { visible: queryVisible } = router.query;

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };


  const closeHandler = () => {
    router.push(
      {
        pathname: '/additional/exercise-level',
        // Example props
      })
      setVisible(false);
  };
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };



  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);


  const handleUpload = () => {
    if (selectedImage) {
      // Implement your image upload logic here
      // You can use libraries like axios to make API requests to your server
      console.log('Selected Image:', selectedImage);
    }
  };

  const handleImageChange = async(file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      const base64 = await toBase64(files[0] as File);

  setBase64(base64 as string);
    }
 };

 const toBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      setImgSrc(fileReader.result as string)
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const handleImageClick = () => {
  fileInputRef.current.click();
};


  return (
<div>

      <Modal
        closeButton
        blur
        width='30%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft:"5px"}}>
               New Exercise level
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
        <form >
        <CardContent>
        <Grid container spacing={5}>
            <Grid item xs={12}>


            </Grid>
            <Grid item xs={12}>
            <Input
          bordered
          labelPlaceholder="Title" width='100%'
          color="primary" />
            </Grid>

            <Grid item xs={12} sm={6}>
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

export default CreateDiscover;
