// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Grid, Typography } from '@mui/material'

export interface RequestType {
  id: number
  title: string
  subtitle: string
  is_reflectable: boolean
  is_attached: boolean
  days_for_attachment: number
  ticket_request: boolean
  days: number
  per: string
  before_days: number
  max_days: number
  salary_reflectable: boolean
  ken_required: boolean
  contact_required: boolean
  address_required: boolean
  additional_days_available: boolean
  weekend_reflectable: boolean
}

type AutoCompleteType = {
  getData: () => Promise<any>
  title: string
  subtitle: string
  option?: RequestType
  setOption: (option: RequestType) => void
  info?: any
}
const AutocompleteAsynchronousRequest = (props: AutoCompleteType) => {
  // ** States
  const [options, setOptions] = useState<RequestType[]>([])
  const { getData, option, setOption } = props

  const [loading, setLoading] = useState(true)
  const fetchData = async () => {
    setLoading(true)
    const res = await getData()
    setLoading(false)
    setOptions(res)
    if (res.length > 0) {
      // setOption({
      //   id: res[0].id,
      //   title: res[0].title,
      //   is_reflectable: res[0].is_reflectable,
      //   is_attached: res[0].is_attached,
      //   ticket_request: res[0].ticket_request
      // })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return loading ? (
    <Box display={'flex'} justifyContent={'center'}>
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  ) : (
    <>
      <Autocomplete
        sx={
          {
            // m: 1
          }
        }
        size='medium'
        options={options}
        fullWidth
        value={option}
        getOptionLabel={option => option.title}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        onChange={(e, newValue) => {
          if (newValue) {
            setOption(newValue)
          }
        }}
        renderInput={params => <TextField {...params} label={props.title} />}
      />
      {option ? (
        <>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Grid display={'flex'} flexDirection={'column'}>
              <Typography variant='caption' color={'blue'}>
                {props.subtitle}
              </Typography>
              <Typography variant='caption' color={'error'}>
                {props.option?.subtitle}
              </Typography>
            </Grid>
            <Typography variant='caption' color={'error'}>
              {props.info}
            </Typography>
          </Box>
        </>
      ) : null}
    </>
  )
}

export default AutocompleteAsynchronousRequest
