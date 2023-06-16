import { Alert, AlertTitle } from "@mui/material"
import { useState, useEffect } from "react"

function SuccessAlert({ message }) {
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
        zIndex: 100
      }}
    >
      {open && (
        <Alert severity="success" onClose={() => setOpen(false)} sx={{ width: '100%' }}>
          <AlertTitle>Created Successfuly</AlertTitle>
          <strong>{message}</strong>
        </Alert>
      )}
    </div>
  )
};

export default SuccessAlert
