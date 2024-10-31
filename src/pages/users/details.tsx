import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Snackbar,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { destroy, get, post, put } from 'src/handler/request.handler'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { Save, Lock } from '@mui/icons-material'
import { LoaderIcon } from 'react-hot-toast'
import CustomizeTable from 'src/@core/components/table'

const columns = [
  { id: 'id', label: 'ID', align: 'center', type: 'text' },
  { id: 'leave_time', label: 'Leave Time', align: 'center', type: 'text' },
  { id: 'type', label: 'Leave Type', align: 'center', type: 'text' },
  { id: 'ask_for_ticket', label: 'Ticket', align: 'center', type: 'text' },
  { id: 'numberOfDays', label: 'Requested days', align: 'center', type: 'text', colored: 'default' },
  {
    id: 'days_available',
    label: 'Available days',
    align: 'center',
    type: 'text',
    colored: 'default'
  },
  { id: 'manager', label: 'Manager', key: 'value', message: 'message', align: 'center', type: 'object' },
  { id: 'status', label: 'Status', key: 'value', message: 'message', align: 'center', type: 'object' },
  { id: 'created_at', label: 'Submitted At', align: 'center', type: 'text' }
]

function UserDetails() {
  const router = useRouter()
  const { id } = router.query
  const auth = useAuth()
  const [show, isShow] = useState(false)
  const [form_data, setFormData] = useState({} as any)
  const [alert, setAlert] = useState({} as any)
  const [loading, isLoading] = useState(false)
  const [managerLoading, isManagerLoading] = useState(false)
  const { logout } = useAuth()
  const [options, setOptions] = useState([])

  const handleShankbarClose = () => {
    isShow(false)
  }

  const fetchData = async () => {
    isManagerLoading(true)
    const res = await get(authConfig.managers)
    if (res && res.status_code == 200) {
      setOptions(res.data)
    }
    isManagerLoading(false)
  }

  const loadData = async () => {
    isLoading(true)
    try {
      const res = await get(authConfig.users + '/' + id)
      if (res && res.status_code == 200) {
        setFormData(res.data)
        fetchData()
      }
      isLoading(false)
    } catch (e) {
      isLoading(false)
    }
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

  const resetPassword = async () => {
    isLoading(true)
    try {
      const res = await post(authConfig.resetPassword + '/' + id, null)
      isLoading(false)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: "The reset password link has been successfully sent to the user's email"
        })
        isShow(true)
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

  const submit = async () => {
    isLoading(true)
    try {
      const data = {
        ...form_data,
        manager_id: form_data?.manager_details?.id
      }
      const res = await put(authConfig.users + '/' + id, data)
      isLoading(false)
      if (res && res.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'Information has been updated successfully'
        })
        isShow(true)
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

  const deleteItem = async (id: number) => {
    return await destroy(authConfig.users + '/' + id)
  }

  useEffect(() => {
    loadData()
  }, [id])

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
      <Grid container>
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
          <Card sx={{ width: 1 }}>
            <CardHeader title='List of Leave Request' />
            <CardContent>
              <Grid display='flex' justifyContent='flex-end' width={1} gap={2} mt={6}>
                <Button
                  color='primary'
                  onClick={submit}
                  variant='contained'
                  endIcon={!loading ? <Save /> : <LoaderIcon />}
                >
                  Save
                </Button>
                <Button
                  color='error'
                  size='small'
                  onClick={resetPassword}
                  variant='outlined'
                  endIcon={!loading ? <Lock /> : <LoaderIcon />}
                >
                  Reset Password
                </Button>
              </Grid>
              <Grid container>
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
                    getOptionLabel={option => option.toUpperCase()}
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
                  {managerLoading ? (
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
                      defaultValue={form_data.manager_details}
                      value={form_data.manager_details}
                      fullWidth
                      getOptionLabel={option => option.first_name + ' ' + option.last_name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          onChangeHandle('manager_details', newValue)
                        }
                      }}
                      renderInput={params => <TextField {...params} label={'Manager'} />}
                    />
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        <Grid item xs={12} mt={10}>
          <Card sx={{ width: 1 }}>
            <CardHeader title='List of Leave Request' />
            <CardContent>
              <CustomizeTable
                isShow={isShow}
                setAlert={setAlert}
                deleteItemHandler={deleteItem}
                id={'id'}
                url={authConfig.requestPerUser + '/' + id}
                columns={columns}
                route={'request-leave'}
                actions={{
                  delete: auth.user?.role == 'admin' || auth.user?.role == 'user',
                  approve: auth.user?.role == 'admin' || auth.user?.role == 'manager',
                  reject: auth.user?.role == 'admin' || auth.user?.role == 'manager'
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default UserDetails
