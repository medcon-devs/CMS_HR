import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle'

import authConfig from 'src/configs/auth'
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  Box,
  FormControlLabel,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  CardHeader
} from '@mui/material'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import PickersRange from 'src/views/forms/form-elements/pickers/PickersRange'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AutocompleteAsynchronousRequest, {
  RequestType
} from 'src/views/forms/form-elements/autocomplete/AutocompleteAsynchronousRequest'
import moment from 'moment'
import { get, multipart, post } from 'src/handler/request.handler'
import { LoaderIcon } from 'react-hot-toast'
import Country from 'src/components/country'

function NewRequest() {
  const router = useRouter()

  const theme = useTheme()
  const { direction } = theme
  const { logout } = useAuth()
  const [show, isShow] = useState(false)
  const [dates, setDate] = useState({
    start: '',
    end: ''
  } as any)
  const [days, setDays] = useState(0)
  const [maxDays, setMaxDays] = useState(0)
  const [daysRequested, setDaysRequested] = useState(0)
  const [form_data, setFormData] = useState({
    inside_country: 1,
    kin_relation: null,
    ticket_request: 0
  } as any)
  const [alert, setAlert] = useState({} as any)
  const [loading, isLoading] = useState(false)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [type, setType] = useState<RequestType>()

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

  const getTypes = async () => {
    try {
      const res = await get(authConfig.types)
      if (res && res.status_code == 200) {
        return res.data
      }
    } catch (e) {}
  }

  const handleTypeChange = async (value: any) => {
    setDate({
      start: '',
      end: ''
    })
    setType(value)
    getNumberOfRemaingDays(value)
  }
  const getNumberOfRemaingDays = async (type: any) => {
    try {
      const res = await post(authConfig.remainingDays, {
        type_id: type?.id
      })
      isLoading(false)
      if (res && res.status_code == 200) {
        setDays(res.data.days)
        setMaxDays(res.data.max_days)
      } else {
        setAlert({
          type: 'error',
          message: 'Error in request, please try again'
        })
        setDays(0)
        isShow(true)
      }
    } catch (e) {}
  }

  const getNumberOfRequestedDays = () => {
    const res = date_diff_indays(dates.start, dates.end)
    if (res > 0) {
      setDaysRequested(res)
    }
  }

  const uploadFile = async (files: any[]) => {
    if (files.length > 0) {
      setFormData({
        ...form_data,
        attachment: files[0]
      })
    }
  }

  useEffect(() => {
    getNumberOfRequestedDays()
  }, [dates.start, dates.end])

  const date_diff_indays = function (date1: string, date2: string) {
    const start = new Date(date1)
    const end = new Date(date2)
    let businessDays = 0
    while (start <= end) {
      const dayOfWeek = start.getDay()

      // Check if the current day is not a weekend (0: Sunday, 6: Saturday)
      if (type?.weekend_reflectable) {
        businessDays++
      } else {
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          businessDays++
        }
      }

      // Move to the next day
      start.setDate(start.getDate() + 1)
    }

    return businessDays
  }

  const submit = async () => {
    isLoading(true)
    try {
      if (!dates.start) {
        isShow(true)
        setAlert({
          type: 'error',
          message: 'Please select the start date'
        })
        isLoading(false)
      } else {
        if (!dates.end) {
          isLoading(false)
          isShow(true)
          setAlert({
            type: 'error',
            message: 'Please select the end date'
          })
        } else {
          const data = {
            ...form_data,
            type_id: type?.id,
            leave_time: moment(dates.start).format('yyyy-MM-DD') + ' / ' + moment(dates.end).format('yyyy-MM-DD')
          }
          const res = await multipart(authConfig.request, data)
          isLoading(false)
          if (res && res.status_code == 200) {
            setAlert({
              type: 'success',
              message: 'A new request has been submitted successfully'
            })
            isShow(true)
            router.push({
              pathname: '/request-leave'
            })
          } else {
            if (res && res.data) {
              setAlert({
                type: 'error',
                message: res.message
              })
            } else {
              setAlert({
                type: 'error',
                message: 'Error in request, please try again'
              })
            }
            isShow(true)
          }
        }
      }
    } catch (e: any) {
      console.log(e)
      if (e?.response?.status == 401) {
        logout()
      }
      setAlert({
        type: 'error',
        message: 'Error in request, please try again'
      })
      isShow(true)
      console.log(e)
      isLoading(false)
    }
  }

  const handleOnChange = (dates: any) => {
    setDate(dates)
    getNumberOfRequestedDays()
  }

  return (
    <DatePickerWrapper>
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
                <Box>
                  <Typography sx={{ display: 'flex', justifyContent: 'center' }} variant='h5' mt={2}>
                    New Leave Request
                  </Typography>

                  <Card sx={{ mt: 3 }}>
                    <CardHeader title='Leave Information' subheader='' />
                    <CardContent>
                      <Grid item xs={12} mt={6}>
                        <AutocompleteAsynchronousRequest
                          getData={async () => {
                            return await getTypes()
                          }}
                          title={'Leave Type'}
                          subtitle={
                            type?.per != 'none'
                              ? `Available Days: ${days} ${days > 1 ? 'days' : 'day'} per ${type?.per ?? ''}`
                              : ``
                          }
                          info={
                            maxDays > 0
                              ? `Maximum Consecutive Days Allowed: ${maxDays} ${maxDays > 1 ? 'days' : 'day'}`
                              : ``
                          }
                          option={type}
                          setOption={handleTypeChange}
                        />
                      </Grid>
                      {type && type.id > 0 ? (
                        <>
                          <Grid item xs={12} mt={6}>
                            <DatePickerWrapper>
                              <PickersRange
                                start_date={dates.start}
                                end_date={dates.end}
                                weekend={type.weekend_reflectable}
                                days={type?.days}
                                type={type}
                                setDate={handleOnChange}
                                popperPlacement={popperPlacement}
                              />
                            </DatePickerWrapper>
                          </Grid>
                          <Grid item xs={12} display={'flex'} justifyContent={'space-between'}>
                            <Typography variant='caption' color={'blue'}>
                              Number of days: {daysRequested} days
                            </Typography>
                            {daysRequested > days ? (
                              <Typography variant='body2' color={'error'}>
                                UAE labor law will be applied
                              </Typography>
                            ) : null}
                          </Grid>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>

                  {type && type.id > 0 ? (
                    <>
                      {type?.address_required ? (
                        <Card sx={{ mt: 3 }}>
                          <CardHeader title='Address Information' subheader='' />
                          <CardContent>
                            <>
                              <Grid>
                                <FormControl>
                                  <FormLabel id='location'>I will be:</FormLabel>
                                  <RadioGroup
                                    row
                                    aria-labelledby='location'
                                    defaultValue={form_data.inside_country}
                                    onChange={(event, value: string) => {
                                      onChangeHandle('inside_country', value)
                                    }}
                                    name='location'
                                  >
                                    <FormControlLabel value='1' control={<Radio />} label='Inside UAE' />
                                    <FormControlLabel value='0' control={<Radio />} label='Outside UAE' />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                              {form_data?.inside_country == 0 ? (
                                <Grid mt={6} justifyContent={'space-between'} alignItems={'center'} width={1} gap={10}>
                                  <Grid width={1}>
                                    <Country
                                      handleChange={(value: string) => {
                                        onChangeHandle('country', value)
                                      }}
                                    />
                                  </Grid>
                                  <Grid width={1} mt={6}>
                                    {type?.ticket_request ? (
                                      <FormControl>
                                        <Grid width={1} gap={10}>
                                          <FormLabel>
                                            <Typography variant='subtitle1'>Request for ticket to home country</Typography>
                                          </FormLabel>
                                          <RadioGroup
                                            row
                                            value={form_data?.ticket_request}
                                            name='radio-buttons-group'
                                            onChange={event => {
                                              onChangeHandle('ticket_request', (event.target as HTMLInputElement).value)
                                            }}
                                          >
                                            <FormControlLabel value={1} control={<Radio />} label='Yes' />
                                            <FormControlLabel value={0} control={<Radio />} label='No' />
                                          </RadioGroup>
                                        </Grid>
                                      </FormControl>
                                    ) : null}
                                  </Grid>
                                </Grid>
                              ) : null}
                            </>
                          </CardContent>
                        </Card>
                      ) : null}
                      {type?.contact_required || type?.address_required ? (
                        <Card sx={{ mt: 3 }}>
                          <CardHeader title='Contact Information' subheader='' />
                          <CardContent>
                            {type?.contact_required ? (
                              <>
                                <Grid item xs={12} mt={6}>
                                  <TextField
                                    value={form_data?.phone || ''}
                                    helperText='My phone number during leave'
                                    required
                                    fullWidth
                                    onChange={input => {
                                      onChangeHandle('phone', input.target.value)
                                    }}
                                    label='Phone Number'
                                    variant='outlined'
                                  />
                                </Grid>
                              </>
                            ) : null}
                            {type?.address_required ? (
                              <Grid item xs={12} mt={6}>
                                <TextField
                                  value={form_data?.address || ''}
                                  helperText='My address during leave'
                                  fullWidth
                                  required
                                  onChange={input => {
                                    onChangeHandle('address', input.target.value)
                                  }}
                                  label='Address'
                                  variant='outlined'
                                />
                              </Grid>
                            ) : null}
                          </CardContent>
                        </Card>
                      ) : null}

                      {type.ken_required ? (
                        <Card sx={{ mt: 3 }}>
                          <CardHeader title='Next of Kin' subheader='your closest living relative' />
                          <CardContent>
                            <Grid item xs={12}>
                              <FormControl>
                                <FormLabel id='kin_relation'>Kin relation:</FormLabel>
                                <RadioGroup
                                  row
                                  aria-labelledby='kin_relation'
                                  defaultValue={form_data?.kin_relation}
                                  onChange={(event, value: string) => {
                                    onChangeHandle('ken_relation', value)
                                  }}
                                  name='Kin relation'
                                >
                                  <FormControlLabel value='relative' control={<Radio />} label='Relative' />
                                  <FormControlLabel value='friend' control={<Radio />} label='Friend' />
                                </RadioGroup>
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} mt={4}>
                              <TextField
                                value={form_data?.name_of_ken || ''}
                                helperText='Name of Kin'
                                required
                                fullWidth
                                onChange={input => {
                                  onChangeHandle('name_of_ken', input.target.value)
                                }}
                                label='Name of Kin'
                                variant='outlined'
                              />
                            </Grid>
                            <Grid item xs={12} mt={4}>
                              <TextField
                                value={form_data?.phone_of_ken || ''}
                                helperText='Phone Number of Kin'
                                required
                                fullWidth
                                onChange={input => {
                                  onChangeHandle('phone_of_ken', input.target.value)
                                }}
                                label='Phone Number of Kin'
                                variant='outlined'
                              />
                            </Grid>
                          </CardContent>
                        </Card>
                      ) : null}
                      {type?.is_attached && daysRequested >= type?.days_for_attachment ? (
                        <Card sx={{ mt: 3 }}>
                          <CardHeader
                            title={type.title + ' Certificate'}
                            subheader={
                              <Typography variant='caption' color={'error'}>
                                Proof of Absence is required for this kind of leave request
                              </Typography>
                            }
                          />
                          <CardContent>
                            <Grid item xs={12}>
                              <FileUploaderSingle action={uploadFile} />
                            </Grid>
                          </CardContent>
                        </Card>
                      ) : null}
                      <Card sx={{ mt: 3 }}>
                        <CardHeader title='Additional Information' subheader='' />
                        <CardContent>
                          <Grid item xs={12} mt={6}>
                            <TextField
                              value={form_data?.note || ''}
                              helperText='Add notes for your manager'
                              fullWidth
                              onChange={input => {
                                onChangeHandle('note', input.target.value)
                              }}
                              label='Notes'
                              variant='outlined'
                            />
                          </Grid>
                        </CardContent>
                      </Card>
                    </>
                  ) : null}
                </Box>
                <Grid display='flex' justifyContent='flex-end' container spacing={2} mt={6}>
                  <Button
                    color='primary'
                    onClick={submit}
                    variant='contained'
                    endIcon={!loading ? null : <LoaderIcon />}
                  >
                    Submit
                  </Button>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}
    </DatePickerWrapper>
  )
}

export default NewRequest
