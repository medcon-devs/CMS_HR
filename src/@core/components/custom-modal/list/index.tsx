import { Box, Grid, Modal, Typography } from '@mui/material'
import React from 'react'
import CustomizeTable from '../../table'

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center', type: 'text' },
  { id: 'first_name', label: 'First Name', minWidth: 170, align: 'center', type: 'text' },
  { id: 'last_name', label: 'Last Name', minWidth: 170, align: 'center', type: 'text' },
  { id: 'email', label: 'Email', minWidth: 170, align: 'center', type: 'text' },
  { id: 'nn_refer', label: 'NN Refer', minWidth: 170, align: 'center', type: 'text' },
  { id: 'country', label: 'Country', minWidth: 170, align: 'center', type: 'text' },
  { id: 'profession', label: 'Profession', minWidth: 170, align: 'center', type: 'text' },
  { id: 'learning_status', label: 'Status', minWidth: 170, align: 'center', type: 'text' },
  { id: 'language', label: 'Language', minWidth: 170, align: 'center', type: 'text' },
]

type ModalType = {
  title: string
  open: boolean
  setOpen: (status: boolean) => void
  url: string
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

function ListModal(props: ModalType) {
  const { open, setOpen, title, url } = props

  const handleClose = () => {
    setOpen(false)
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
          {open ? (
            <CustomizeTable
              id={'id'}
              url={url}
              columns={columns}
              route={'users'}
              actions={{ delete: false, edit: false }}
            />
          ) : null}
        </Grid>
      </Box>
    </Modal>
  )
}

export default ListModal
