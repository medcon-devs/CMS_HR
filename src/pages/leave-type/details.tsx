import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { get, put } from 'src/handler/request.handler'
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Snackbar,
  Switch,
  TextField
} from '@mui/material'
import { LoaderIcon } from 'react-hot-toast'

function TypeDetails() {
  const router = useRouter()
  const { id } = router.query
  const { logout } = useAuth()
  const [info, setInfo] = useState({} as any)
  const [loading, isLoading] = useState(true)
  const [show, isShow] = useState(false)
  const [alert, setAlert] = useState({} as any)

  const init = async () => {
    isLoading(true)
    if (id) {
      const res = await get(authConfig.types + '/' + id)
      if (res?.status_code == 200) {
        setInfo(res.data)
        isLoading(false)
      } else {
        console.log(res)
        isLoading(false)
      }
    }
  }

  const submit = async () => {
    try {
      isLoading(true)
      const res = await put(authConfig.types + '/' + id, info)

      if (res?.status_code == 200) {
        setAlert({
          type: 'success',
          message: 'Information has been updated successfully'
        })
        isShow(true)
        isLoading(false)
      } else {
        isLoading(false)
      }
    } catch (e: any) {
      if (e.response.status == 401) {
        logout()
      }
      isLoading(false)
      console.log(e)
    }
  }

  const handleShankbarClose = () => {
    isShow(false)
  }

  const onChangeHandle = (key: string, value: any, attr?: string) => {
    if (attr) {
      setInfo({
        ...info,
        [key]: {
          ...info?.[key],
          [attr]: value
        }
      })
    } else {
      setInfo({
        ...info,
        [key]: value
      })
    }
  }

  useEffect(() => {
    init()
  }, [])

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
          <Grid container spacing={2} mt={6}>
            <Card sx={{ width: 1 }}>
              <CardContent>
                <Grid item xs={12} mt={6}>
                  <TextField
                    value={info?.title || ''}
                    helperText='Please enter the name'
                    fullWidth
                    onChange={input => {
                      onChangeHandle('title', input.target.value)
                    }}
                    label='Name'
                  />
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ width: 1, mt: 5 }}>
              <CardHeader title={'Type details'} />
              <CardContent>
                <Grid container spacing={10}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={info?.days}
                      helperText='Please input the allowed number of days.'
                      fullWidth
                      size='small'
                      type='number'
                      onChange={input => {
                        onChangeHandle('days', input.target.value)
                      }}
                      label='Allowed Days'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={info?.before_days}
                      helperText='Advance Notice Period for Leave.'
                      fullWidth
                      size='small'
                      type='number'
                      onChange={input => {
                        onChangeHandle('before_days', input.target.value)
                      }}
                      label='Advance Notice Period for Leave'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={info?.max_days}
                      helperText='Maximum Consecutive Days Allowed.'
                      fullWidth
                      size='small'
                      type='number'
                      onChange={input => {
                        onChangeHandle('max_days', input.target.value)
                      }}
                      label='Maximum Consecutive Days Allowed'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {info.is_attached ? (
                      <TextField
                        value={info?.days_for_attachment}
                        helperText='The minimum number of days required to request an attachment.'
                        fullWidth
                        size='small'
                        type='number'
                        onChange={input => {
                          onChangeHandle('days_for_attachment', input.target.value)
                        }}
                        label='The minimum number of days required to request an attachment'
                      />
                    ) : null}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ width: 1, mt: 5 }}>
              <CardHeader title={'The permitted days will be'} />

              <CardContent>
                <Grid item xs={12} md={12}>
                  <FormControl>
                    <Grid width={1}>
                      <RadioGroup
                        row
                        value={info?.per}
                        name='radio-buttons-group'
                        onChange={event => {
                          onChangeHandle('per', (event.target as HTMLInputElement).value)
                        }}
                      >
                        <FormControlLabel value={'none'} control={<Radio />} label='None' />
                        <FormControlLabel value={'week'} control={<Radio />} label='Weekly' />
                        <FormControlLabel value={'month'} control={<Radio />} label='Monthly' />
                        <FormControlLabel value={'year'} control={<Radio />} label='Yearly' />
                      </RadioGroup>
                    </Grid>
                  </FormControl>
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ width: 1, mt: 5,  }}>
              <CardContent>
                <Grid
                  item
                  md={12}
                  xs={12}
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  sx={{ flexDirection: { md: 'row', xs: 'column' } }}
                  justifyContent={'space-around'}
                  gap={2}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={info?.emergency || false}
                          onChange={event => {
                            onChangeHandle('emergency', event.target.checked)
                          }}
                        />
                      }
                      label='Emergency Available'
                    />
                  </FormGroup>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  display={'flex'}
                  flexDirection={'row'}
                  alignItems={'center'}
                  sx={{ flexDirection: { md: 'row', xs: 'column' } }}
                  justifyContent={'space-around'}
                  gap={2}
                >
                  <Grid display={'flex'} flexDirection={'column'}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={info?.is_reflectable || false}
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
                            checked={info?.is_attached || false}
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
                            checked={info?.ticket_request || false}
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
                            checked={info?.salary_reflectable || false}
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
                            checked={info?.ken_required || false}
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
                            checked={info?.contact_required || false}
                            onChange={event => {
                              onChangeHandle('contact_required', event.target.checked)
                            }}
                          />
                        }
                        label='Contact details'
                      />
                    </FormGroup>
                  </Grid>
                  <Grid>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={info?.address_required || false}
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
                            checked={info?.weekend_reflectable || false}
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
              </CardContent>
            </Card>
          </Grid>
          <Grid display='flex' justifyContent='flex-end' container spacing={2} mt={6}>
            <Button color='primary' onClick={submit} variant='contained' endIcon={!loading ? null : <LoaderIcon />}>
              Submit
            </Button>
          </Grid>
        </>
      )}
    </>
  )
}

export default TypeDetails
