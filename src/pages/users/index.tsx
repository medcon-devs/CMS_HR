// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomizeTable from 'src/@core/components/table'
import authConfig from 'src/configs/auth'
import { Alert, Button, CircularProgress, Fab, Modal, Snackbar, TextField, Box, Autocomplete } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from 'src/hooks/useAuth'
import { LoaderIcon } from 'react-hot-toast'
import { Save } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { destroy, get, post } from 'src/handler/request.handler'

const columns = [
  { id: 'id', label: 'ID', minWidth: 50, align: 'center', type: 'text' },
  { id: 'fullName', label: 'Full Name', minWidth: 100, align: 'center', type: 'text' },
  { id: 'email', label: 'email', maxWidth: 200, align: 'center', type: 'text' },
  { id: 'manager', label: 'Manager', maxWidth: 100, align: 'center', type: 'text', colored: 'info' },
  { id: 'days', label: 'Available Days', align: 'center', type: 'array', key: 'key' },
  { id: 'consumed_days', label: 'Consumed Days', align: 'center', type: 'array', key: 'key' }
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 380,
  width: '50%',
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

const User = () => {
  const router = useRouter()
  const { logout } = useAuth()

  const [show, isShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [form_data, setFormData] = useState({} as any)
  const [alert, setAlert] = useState({} as any)
  const [loading, isLoading] = useState(false)
  const [addLoading, isAddLoading] = useState(false)
  const [options, setOptions] = useState([])

  const fetchData = async () => {
    isAddLoading(true)
    const res = await get(authConfig.managers)
    if (res && res.status_code == 200) {
      isAddLoading(false)
      setOptions(res.data)
    }
    isAddLoading(false)
  }

  const fabs = [
    {
      color: 'primary',
      sx: fabStyle,
      icon: <AddIcon />,
      label: 'Add',
      action: () => {
        setOpen(true)
        fetchData()
      }
    }
  ]

  const deleteItem = async (id: number) => {
    return await destroy(authConfig.users + '/' + id)
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
      let data = {
        ...form_data,
        manager_id: null
      }
      if (form_data.manager_id) {
        data = {
          manager_id: form_data.manager_id.id
        }
      }

      const res = await post(authConfig.users, data)
      isLoading(false)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'A new user has been added successfully'
        })
        setOpen(false)
        isShow(true)
        router.push({
          pathname: 'users/details',
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
      console.log(e)
      if (e?.response?.status == 401) {
        logout()
      }
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
            Add new user
          </Typography>

          <Grid item xs={12} mt={6}>
            <TextField
              value={form_data?.first_name || ''}
              helperText='Please enter the first name'
              fullWidth
              onChange={input => {
                onChangeHandle('first_name', input.target.value)
              }}
              label='Frist Name'
              variant='standard'
            />
          </Grid>
          <Grid item xs={12} mt={6}>
            <TextField
              value={form_data?.last_name || ''}
              helperText='Please enter the last name'
              fullWidth
              onChange={input => {
                onChangeHandle('last_name', input.target.value)
              }}
              label='Last Name'
              variant='standard'
            />
          </Grid>
          <Grid item xs={12} mt={6}>
            <TextField
              value={form_data?.email || ''}
              helperText='Please enter the email'
              fullWidth
              onChange={input => {
                onChangeHandle('email', input.target.value)
              }}
              label='Email Address'
              variant='standard'
            />
          </Grid>
          <Grid item xs={12} mt={6}>
            <Autocomplete
              size='medium'
              options={['user', 'manager']}
              defaultValue={form_data.role}
              value={form_data.role}
              fullWidth
              getOptionLabel={option => option}
              isOptionEqualToValue={(option, value) => option === value}
              onChange={(e, newValue) => {
                if (newValue) {
                  onChangeHandle('role', newValue)
                }
              }}
              renderInput={params => <TextField {...params} label={'User Role'} />}
            />
          </Grid>

          <Grid item xs={12} mt={6}>
            {addLoading ? (
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
            ) : (
              <Autocomplete
                size='medium'
                options={options}
                defaultValue={form_data.manager_id}
                value={form_data.manager_id}
                fullWidth
                getOptionLabel={option => option.first_name + ' ' + option.last_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(e, newValue) => {
                  if (newValue) {
                    onChangeHandle('manager_id', newValue)
                  }
                }}
                renderInput={params => <TextField {...params} label={'Manager'} />}
              />
            )}
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
          <CardHeader title='List of Users' />
          <CardContent>
            <CustomizeTable
              isShow={isShow}
              setAlert={setAlert}
              deleteItemHandler={deleteItem}
              id={'id'}
              url={authConfig.users}
              columns={columns}
              route={'users'}
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

export default User
