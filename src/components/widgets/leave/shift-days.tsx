import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from 'src/hooks/useAuth'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography
} from '@mui/material'
import { LoaderIcon } from 'react-hot-toast'
import { Save } from '@mui/icons-material'
import CustomizeTable from 'src/@core/components/table'
import { destroy, post } from 'src/handler/request.handler'
import authConfig from 'src/configs/auth'
import dayjs from 'dayjs'

const columns = [
  { id: 'id', label: 'ID', align: 'center', type: 'text' },
  { id: 'user', label: 'Employee', align: 'center', type: 'text' },
  { id: 'days', label: 'Days', align: 'center', type: 'text', colored: 'success' },
  { id: 'year', label: 'Year', align: 'center', type: 'text', colored: 'info' },
  { id: 'note', label: 'Note', align: 'center', type: 'text' },
  { id: 'status', label: 'Status', align: 'center', type: 'text', colored: 'default' },
  { id: 'created_at', label: 'Created At', align: 'center', type: 'text' }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 380,
  width: 600,
  maxHeight: 800,
  bgcolor: 'background.paper',
  border: '2px solid #e3e3e333',
  boxShadow: 24,
  p: 5,
  overflowY: 'scroll'
}

const fabStyle = {
  position: 'fixed',
  bottom: 40,
  right: 40
}

function ShiftDays() {
  
  const auth = useAuth()
  const [show, isShow] = useState(false)

  const [open, setOpen] = useState(false)
  const [alert, setAlert] = useState({} as any)
  const [value, setValue] = React.useState('1')
  const [loading, isLoading] = useState(false)
  const [form_data, setFormData] = useState({} as any)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  const deleteItem = async (id: number) => {
    return await destroy(authConfig.transferDays + '/' + id)
  }

  const handleShankbarClose = () => {
    isShow(false)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const submit = async () => {
    isLoading(true)
    if (!form_data.note || form_data.note == '') {
      setAlert({
        type: 'error',
        message: 'Please type a note'
      })
      isShow(true)
      isLoading(false)
    } else {
      const data = {
        ...form_data,
        additional_days: value
      }
      try {
        const res = await post(authConfig.transferDays, data)
        if (res && res.status_code == 200) {
          setAlert({
            type: 'success',
            message: 'A Shift days has been submitted successfully'
          })
          setOpen(false)
          isShow(true)
        } else {
          setAlert({
            type: 'error',
            message: 'Please check the details and try again'
          })
          isShow(true)
        }
        isLoading(false)
      } catch (e) {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isShow(true)
        isLoading(false)
      }
    }
  }
  const onChangeHandle = (key: string, value: any) => {
    setFormData({
      ...form_data,
      [key]: value
    })
  }

  const fabs = [
    {
      color: 'primary',
      sx: fabStyle,
      icon: <AddIcon />,
      label: 'Add',
      action: () => {
        setOpen(true)
      }
    }
  ]

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={show}
        onClose={() => {
          isShow(false)
        }}
      >
        <Alert variant='filled' onClose={handleShankbarClose} severity={alert?.type} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>
      <Card>
        <CardHeader title='List of Requests' />
        <CardContent>
          <CustomizeTable
            isShow={isShow}
            setAlert={setAlert}
            deleteItemHandler={deleteItem}
            id={'id'}
            url={authConfig.transferDays}
            columns={columns}
            route={'request-leave'}
            actions={{
              delete: auth.user?.role == 'admin' || auth.user?.role == 'user',
              approve: auth.user?.role == 'manager',
              reject: auth.user?.role == 'manager',
              status: true
            }}
          />
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant='h5' mt={2}>
            Shift days to next year
          </Typography>
          <Grid p={3} mt={4}>
            <FormControl>
              <Typography id='demo-controlled-radio-buttons-group' variant='body1'>
                Days required for the shift:
              </Typography>
              <Typography variant='caption'>From {dayjs().year() + ' to ' + (dayjs().year() + 1)}</Typography>
              <RadioGroup
                aria-labelledby='demo-controlled-radio-buttons-group'
                name='controlled-radio-buttons-group'
                value={value}
                row
                onChange={handleChange}
              >
                <FormControlLabel value='1' control={<Radio />} label='1 Day' />
                <FormControlLabel value='2' control={<Radio />} label='2 Days' />
                <FormControlLabel value='3' control={<Radio />} label='3 Days' />
                <FormControlLabel value='4' control={<Radio />} label='4 Days' />
                <FormControlLabel value='5' control={<Radio />} label='5 Days' />
              </RadioGroup>
            </FormControl>
            <Grid item xs={12} mt={6}>
              <TextField
                value={form_data?.note || ''}
                helperText='Please enter note'
                fullWidth
                required
                onChange={input => {
                  onChangeHandle('note', input.target.value)
                }}
                label='Note'
              />
            </Grid>
          </Grid>
          {loading ? (
            <>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CircularProgress
                  disableShrink
                  sx={{
                    mt: 2
                  }}
                />
              </Box>
            </>
          ) : (
            <>
              <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} item xs={12} mt={6}>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={submit}
                  endIcon={!loading ? <Save /> : <LoaderIcon />}
                >
                  Save
                </Button>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
            </>
          )}
        </Box>
      </Modal>
      {fabs.map((fab, index) => (
        <Fab key={index} sx={fab.sx} onClick={fab.action} aria-label={fab.label} size={'large'}>
          {fab.icon}
        </Fab>
      ))}
    </>
  )
}

export default ShiftDays
