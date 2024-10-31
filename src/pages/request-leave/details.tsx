import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { get, put } from 'src/handler/request.handler'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import authConfig from 'src/configs/auth'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  Snackbar,
  Switch
} from '@mui/material'
import { Save } from '@mui/icons-material'
import { LoaderIcon } from 'react-hot-toast'
import PickersRange from 'src/views/forms/form-elements/pickers/PickersRange'
import { ReactDatePickerProps } from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AutocompleteAsynchronousRequest, {
  RequestType
} from 'src/views/forms/form-elements/autocomplete/AutocompleteAsynchronousRequest'

function LeaveDetails() {
  const router = useRouter()
  const { id } = router.query
  const theme = useTheme()
  const { direction } = theme

  const { logout } = useAuth()
  const [info, setInfo] = useState({} as any)
  const [loading, isLoading] = useState(true)
  const [typeLoading, isTypeLoading] = useState(true)
  const [show, isShow] = useState(false)
  const [alert, setAlert] = useState({} as any)
  const [dates, setDate] = useState([] as any)
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const [type, setType] = useState<RequestType>()

  const init = async () => {
    console.log(dates)
    isLoading(true)
    if (id) {
      const res = await get(authConfig.request + '/' + id)
      if (res?.status_code == 200) {
        setInfo(res.data)
        isLoading(false)
      } else {
        console.log(res)
        isLoading(false)
      }
    }
  }

  const getTypes = async () => {
    try {
      isTypeLoading(true)
      const res = await get(authConfig.types)
      if (res && res.status_code == 200) {
        isTypeLoading(false)

        return res.data
      } else {
        isTypeLoading(false)
      }
    } catch (e) {
      isLoading(false)
    }
  }

  const handleOnChange = (dates: any) => {
    setDate(dates)
    console.log(dates)
  }

  const handleTypeChange = async (value: any) => {
    setType(value)
  }

  const submit = async () => {
    try {
      isLoading(true)
      const res = await put(authConfig.request + '/' + id, info)

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
            <Grid display='flex' justifyContent='flex-end' container spacing={2} mt={6}>
              <Button
                color='primary'
                onClick={submit}
                variant='contained'
                endIcon={!loading ? <Save /> : <LoaderIcon />}
              >
                Save
              </Button>
            </Grid>
            <Grid container spacing={2} mt={6}>
              <Card sx={{ width: 1 }}>
                <CardContent>
                  <Grid item md={12} xs={12} mt={6} display={'flex'} justifyContent={'center'}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={info?.priority}
                            onChange={event => {
                              onChangeHandle('priority', event.target.checked)
                            }}
                          />
                        }
                        label='Urgent'
                      />
                    </FormGroup>
                    {type && type.ticket_request ? (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={info?.ticket_request}
                              onChange={event => {
                                onChangeHandle('ticket_request', event.target.checked)
                              }}
                            />
                          }
                          label='Ask for Ticket'
                        />
                      </FormGroup>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} mt={6}>
                    {typeLoading ? (
                      <></>
                    ) : (
                      <AutocompleteAsynchronousRequest
                        getData={async () => {
                          return await getTypes()
                        }}
                        title={'Types'}
                        option={type}
                        subtitle={`Remaining Days: ${type?.days} days`}
                        setOption={handleTypeChange}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} mt={6}>
                    <Box sx={{}}>
                      <PickersRange
                        type={type}
                        weekend
                        setDate={handleOnChange}
                        popperPlacement={popperPlacement}
                        start_date={info.start_date}
                        end_date={info.end_date}
                      />
                    </Box>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </DatePickerWrapper>
    </>
  )
}

export default LeaveDetails
