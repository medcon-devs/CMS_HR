import { Box, CircularProgress, Grid, Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import { multipart } from 'src/handler/request.handler'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle'

type ModalType = {
  title: string
  open: boolean
  setOpen: (status: boolean) => void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #e3e3e3',
  borderRadius: 2,
  boxShadow: 30,
  p: 4
}

function ImportModal(props: ModalType) {
  const { open, setOpen, title } = props
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }
  const uploadFile = async (files: any[]) => {
    setLoading(true)
    let data = {}
    try {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (files.length > 0) {
        data = {
          file: files[0]
        }
      }
      const res = await multipart(authConfig.uploadDataSources, data, storedToken)
      if (res && res.status_code == 200) {
        toast.success('The Records were uploaded successfully.', {
          duration: 2000
        })
        setOpen(false);
        setLoading(false)
      } else {
        toast.error('Something wrong, please check the file and try again.', {
          duration: 2000
        })
        setLoading(false)
      }
    } catch (e) {
      toast.error('Something wrong, please check the file and try again.', {
        duration: 2000
      })
      setLoading(false)
    }
  }
  
  return (
  
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Grid item xs={12} mt={6}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} mt={6}>
          {!loading ? (
            <FileUploaderSingle action={uploadFile} />
          ) : (
            <Grid display={'flex'} justifyContent={'center'} alignItems={'center'}>
              <CircularProgress disableShrink sx={{ mt: 6 }} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  )
}

export default ImportModal
