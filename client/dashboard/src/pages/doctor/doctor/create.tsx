import { Button as Button1, Grid, FormControl, InputLabel, TextField, CardActions, CardContent, Divider, ButtonProps, Typography, styled, IconButton } from '@mui/material';
import Box from '@mui/material/Box'
import React, { ChangeEvent, ElementType, useRef, useState } from 'react'
import { Modal,Button , Text, Radio, Textarea, Input, Dropdown } from "@nextui-org/react";
import { useRouter } from 'next/router'
import { Select, MenuItem } from '@mui/material';
import { Label } from 'mdi-material-ui'
import { PhotoCamera } from '@mui/icons-material'


const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '50%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

function CreateDoctor() {

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

  const [base64, setBase64] = useState<string | null>(null);


  const router = useRouter();
  const { visible: queryVisible } = router.query;



  const closeHandler = () => {
    router.push(
      {
        pathname: '/doctor/doctor',
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

const [selected, setSelected] = React.useState(new Set(["Doctor category"]));

const selectedValue = React.useMemo(
  () => Array.from(selected).join(", ").replaceAll("_", " "),
  [selected]
);


  return (
<div>

      <Modal
        closeButton
        blur
        width='60%'
        aria-labelledby="modal-title"
        open={queryVisible || visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={24}>
            Create
            <Text b size={24} style={{ marginLeft:"5px"}}>
               New Doctor
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
          labelPlaceholder="Doctor Name" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} sm={6}>
            <Input
          bordered
          labelPlaceholder="Experience" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} marginTop={5} sm={6} >
            <Textarea
          bordered
          color="primary" width='100%'
          labelPlaceholder="Description"
        />           </Grid>
        <Grid item xs={12} sm={6} marginTop={5}>
            <Input
          bordered
          labelPlaceholder="Phone No" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} sm={6} marginTop={5}>
            <Input
          bordered
          labelPlaceholder="Working Days" width='100%'
          color="primary" />
            </Grid>

            <Grid item xs={12} sm={6} marginTop={5}>
            <Input
          bordered
          labelPlaceholder="Working hour" width='100%'
          color="primary" />
            </Grid>
            <Grid item xs={12} sm={3} marginTop={5}>
            <Radio.Group label="Status" defaultValue="1" orientation="horizontal">
      <Radio value="1" size="sm" isSquared>
        Active
      </Radio>
      <Radio value="0" size="sm" isSquared>
       Inactive
      </Radio>

    </Radio.Group>
            </Grid>
            <Grid item xs={12} sm={3} marginTop={7}>
            <Dropdown>
      <Dropdown.Button flat color="secondary" css={{ tt: "capitalize", width:"100%" }}>
        {selectedValue}
      </Dropdown.Button>
      <Dropdown.Menu
        aria-label="Single selection actions"
        color="secondary"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <Dropdown.Item key="text">Text</Dropdown.Item>
        <Dropdown.Item key="number">Number</Dropdown.Item>
        <Dropdown.Item key="date">Date</Dropdown.Item>
        <Dropdown.Item key="single_date">Single Date</Dropdown.Item>
        <Dropdown.Item key="iteration">Iteration</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
            </Grid>
            <Grid marginTop={5} marginX={10}>

          <div style={{ position: 'relative', display: 'inline-block' }}>
        <img width={100} src={imgSrc}  alt="Angular" onClick={handleImageClick} style={{ borderRadius: '5%' }} />
        <IconButton
          onClick={handleImageClick}
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        >
          <PhotoCamera />
        </IconButton>
      </div>
      <input
      ref={fileInputRef}
     type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
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

export default CreateDoctor;
