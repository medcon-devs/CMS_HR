// ** React Imports
import { useState, forwardRef, useCallback, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'
import { getDay } from 'date-fns'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import dayjs from 'dayjs'

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

const PickersRange = ({
  weekend,
  setDate,
  start_date,
  end_date,
  popperPlacement,
  type,
  emergency
}: {
  weekend: boolean
  setDate: (date: any) => void
  start_date?: string | null
  end_date?: string | null
  popperPlacement: ReactDatePickerProps['popperPlacement']
  days?: number
  type: any
  emergency?: boolean
}) => {
  // ** States
  const [startDate, setStartDate] = useState<DateType>(
    start_date ? new Date(start_date) : dayjs().add(type.before_days, 'day').toDate()
  )
  const [endDate, setEndDate] = useState<DateType>(
    end_date
      ? new Date(end_date)
      : dayjs()
          .add(type.before_days + 1, 'day')
          .toDate()
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    setDate({
      start: start,
      end: end
    })
  }

  useEffect(() => {
    setStartDate(start_date ? new Date(start_date) : dayjs().add(type.before_days, 'day').toDate())
  }, [start_date])

  useEffect(() => {
    setEndDate(
      end_date
        ? new Date(end_date)
        : dayjs()
            .add(type.before_days + 1, 'day')
            .toDate()
    )
  }, [end_date])

  type DaysOfTheWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

  const exclude = ['Saturday', 'Sunday']
  const DAYS_OF_THE_WEEK: DaysOfTheWeek[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })
  const handleExcludedDates = useCallback(
    (date: Date) => {
      if (!exclude?.length) return true
      const day = getDay(date)

      return !exclude?.includes(DAYS_OF_THE_WEEK[day])
    },
    [exclude]
  )

  const addWeekdays = () => {
    let resultDate = dayjs(startDate)
    if (type.max_days > 0) {
      let remainingDays = type.max_days - 1

      while (remainingDays > 0) {
        resultDate = resultDate.add(1, 'day')
        if (!type.weekend_reflectable) {
          if (resultDate.day() !== 0 && resultDate.day() !== 6) {
            // Skip weekends (Sunday and Saturday)
            remainingDays--
          }
        } else {
          remainingDays--
        }
      }

      return resultDate.toDate()
    } else {
      return
    }
  }

  return (
    <Box id={'demo-space-x'} sx={{}} className='demo-space-x'>
      <div>
        <DatePicker
          selectsRange
          endDate={endDate}
          startDate={startDate}
          selected={startDate}
          minDate={dayjs().add(type.before_days, 'day').toDate()}
          maxDate={emergency ? undefined : addWeekdays()} // Maximum date is 22 days from the selected date
          dateFormat='yyyy/MM/dd'
          filterDate={weekend ? undefined : handleExcludedDates}
          onInputClick={() => setIsOpen(true)}
          onClickOutside={() => setIsOpen(false)}
          open={isOpen}
          id='date-range-picker'
          onChange={handleOnChange}
          className='text-center date-picker-reports'
          dropdownMode='select'
          portalId='demo-space-x'
          popperPlacement={popperPlacement}
          customInput={<CustomInput label='Date' start={startDate as Date | number} end={endDate as Date | number} />}
        />
      </div>
    </Box>
  )
}

export default PickersRange
