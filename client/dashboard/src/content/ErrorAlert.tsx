import { Alert, AlertTitle } from "@mui/material"
import { useState, useEffect } from "react"

function ErrorAlert({ message }) {
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
        zIndex: 100,
        backgroundColor: 'rgba(255, 0, 0, 0.3)
      }}
    >
      {open && (
        <Alert severity="error" onClose={() => setOpen(false)} sx={{ width: '100%', color: "#F45050" }}>
          <AlertTitle>Error</AlertTitle>
          <strong>{message}</strong>
        </Alert>
      )}
    </div>
  )
};

export default ErrorAlert
