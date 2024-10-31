// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomizeTable from 'src/@core/components/table'
import authConfig from 'src/configs/auth'
import {
  Alert,
  Button,
  CircularProgress,
  Fab,
  Modal,
  Snackbar,
  TextField,
  Box,
  FormGroup,
  FormControlLabel,
  Switch
} from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from 'src/hooks/useAuth'
import { LoaderIcon } from 'react-hot-toast'
import { Save } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { destroy, post } from 'src/handler/request.handler'

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center', type: 'text' },
  { id: 'title', label: 'Title', minWidth: 170, align: 'center', type: 'text' },
  { id: 'reflectable', label: 'Reflectable', maxWidth: 50, align: 'center', type: 'text' },
  { id: 'attached', label: 'Attached', maxWidth: 50, align: 'center', type: 'text' },
  { id: 'ticket_available', label: 'Ticket Request', maxWidth: 50, align: 'center', type: 'text' }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 380,
  width: '60%',
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

const LeaveType = () => {
  const router = useRouter()
  const { logout } = useAuth()

  const [show, isShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [form_data, setFormData] = useState({} as any)
  const [alert, setAlert] = useState({} as any)
  const [loading, isLoading] = useState(false)

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

  const deleteItem = async (id: number) => {
    return await destroy(authConfig.types + '/' + id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onChangeHandle = (key: string, value: any, attr?: string) => {
    if (attr) {
      setFormData({
        ...form_data,
        [key]: {
          ...form_data?.[key],
          [attr]: value
        }
      })
    } else {
      setFormData({
        ...form_data,
        [key]: value
      })
    }
  }

  const handleShankbarClose = () => {
    isShow(false)
  }

  const submit = async () => {
    isLoading(true)
    try {
      const res = await post(authConfig.types, form_data)
      isLoading(false)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'A new type has been added successfully'
        })
        setOpen(false)
        isShow(true)
        router.push({
          pathname: 'leave-type/details',
          query: { id: res.data.id }
        })
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        isShow(true)
      }
    } catch (e: any) {
      if (e.response.status == 401) {
        logout()
      }
      console.log(e)
      isLoading(false)
    }
  }

  return (
    <Grid container spacing={6}>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        sx={{ zIndex: '99999' }}
        open={show}
        onClose={() => {
          isShow(false)
        }}
      >
        <Alert variant='filled' onClose={handleShankbarClose} severity={alert?.type} sx={{ width: '100%' }}>
          {alert?.message}
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant='h5' mt={2}>
            Add new type
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8} mt={6}>
              <TextField
                value={form_data?.title || ''}
                helperText='Please input the name of the type'
                fullWidth
                onChange={input => {
                  onChangeHandle('title', input.target.value)
                }}
                label='Name'
              />
            </Grid>
            <Grid item xs={12} md={4} mt={6}>
              <TextField
                value={form_data?.days || 0}
                helperText='Please input the allowed number of days.'
                fullWidth
                type='number'
                onChange={input => {
                  onChangeHandle('days', input.target.value)
                }}
                label='Days'
              />
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            mt={6}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-evenly'}
            gap={2}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={form_data?.emergency}
                    onChange={event => {
                      onChangeHandle('emergency', event.target.checked)
                    }}
                  />
                }
                label='Emergency available'
              />
            </FormGroup>
          </Grid>
          <Grid
            item
            md={12}
            xs={12}
            mt={6}
            display={'flex'}
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-evenly'}
            gap={2}
          >
            <Grid display={'flex'} flexDirection={'column'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.is_reflectable}
                      onChange={event => {
                        onChangeHandle('is_reflectable', event.target.checked)
                      }}
                    />
                  }
                  label='Reflect on days'
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.is_attached}
                      onChange={event => {
                        onChangeHandle('is_attached', event.target.checked)
                      }}
                    />
                  }
                  label='Attached required'
                />
              </FormGroup>
            </Grid>
            <Grid display={'flex'} flexDirection={'column'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.ticket_request}
                      onChange={event => {
                        onChangeHandle('ticket_request', event.target.checked)
                      }}
                    />
                  }
                  label='Ticket available'
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.salary_reflectable}
                      onChange={event => {
                        onChangeHandle('salary_reflectable', event.target.checked)
                      }}
                    />
                  }
                  label='Reflect on salary'
                />
              </FormGroup>
            </Grid>
            <Grid display={'flex'} flexDirection={'column'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.ken_required}
                      onChange={event => {
                        onChangeHandle('ken_required', event.target.checked)
                      }}
                    />
                  }
                  label='Kin details'
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.contact_required}
                      onChange={event => {
                        onChangeHandle('contact_required', event.target.checked)
                      }}
                    />
                  }
                  label='Contact details'
                />
              </FormGroup>
            </Grid>
            <Grid display={'flex'} flexDirection={'column'}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.address_required}
                      onChange={event => {
                        onChangeHandle('address_required', event.target.checked)
                      }}
                    />
                  }
                  label='Address during the holiday'
                />
              </FormGroup>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form_data?.weekend_reflectable}
                      onChange={event => {
                        onChangeHandle('weekend_reflectable', event.target.checked)
                      }}
                    />
                  }
                  label='Weekend Included'
                />
              </FormGroup>
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
      <Grid item xs={12}>
        <Card>
          <CardHeader title='List of Types' />
          <CardContent>
            <CustomizeTable
              isShow={isShow}
              setAlert={setAlert}
              deleteItemHandler={deleteItem}
              id={'id'}
              url={authConfig.types}
              columns={columns}
              route={'leave-type'}
              actions={{ delete: true, edit: true }}
            />
          </CardContent>
        </Card>
        {fabs.map((fab, index) => (
          <Fab key={index} sx={fab.sx} onClick={fab.action} aria-label={fab.label} size={'large'}>
            {fab.icon}
          </Fab>
        ))}
      </Grid>
    </Grid>
  )
}

export default LeaveType
