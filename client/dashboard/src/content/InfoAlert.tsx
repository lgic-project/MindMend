import { Alert, AlertTitle } from "@mui/material"
import { useState, useEffect } from "react"
import styles from '../../styles/alert.module.css' // Import the CSS module for styling and animation


function InfoAlert({ message }) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false)
    }, 8000)

    return () => {
      clearTimeout(timer)
    }
  }, [])


  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '20px',
        zIndex: 5
      }}
      className={`${open ? styles.slideIn : styles.slideOut}`}
    >
      {open && (
        <Alert severity="info" onClose={() => setOpen(false)} sx={{ width: '100%', backgroundColor: '#B9E9FC', color: '#19376D' }}>
          <AlertTitle>Record displayed successfully</AlertTitle>
          <strong>{message}</strong>
        </Alert>
      )}
    </ div>
  )
};

export default InfoAlert
