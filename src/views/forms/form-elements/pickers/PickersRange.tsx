// ** React Imports
import { useState, forwardRef, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

// ** Third Party Imports
import format from 'date-fns/format'

// import { getDay } from 'date-fns'
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
  
  // start_date,
  // end_date,
  popperPlacement,
  type,
  emergency,
  availabe_days
}: {
  weekend: boolean
  setDate: (date: any) => void
  start_date?: string | null
  end_date?: string | null
  popperPlacement: ReactDatePickerProps['popperPlacement']
  type: any
  emergency?: boolean
  availabe_days?: number
}) => {
  // Initialize with null
  const [startDate, setStartDate] = useState<DateType | null>(null)
  const [endDate, setEndDate] = useState<DateType | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOnChange = (dates: any) => {
  const [start, end] = dates

  if (start && end && availabe_days) {
    let totalDays = 0
    let current = dayjs(start)
  
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const day = current.day()
      const isWeekend = day === 0 || day === 6
      if (weekend || !isWeekend) {
        totalDays++
      }
      current = current.add(1, 'day')
    }

    if (totalDays > availabe_days) {
      alert(`You can only select up to ${availabe_days} days`)

      return
    }
  }

  setStartDate(start)
  setEndDate(end)
  setDate({ start, end })
}


  // Remove syncing with props unless needed explicitly
  // If needed (like in edit mode), you can do a controlled update using a flag or context

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startVal = props.start ? format(props.start, 'MM/dd/yyyy') : ''
    const endVal = props.end ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ''
    const value = `${startVal}${endVal}`

    return <TextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleExcludedDates = useCallback((date: Date) => {
    const day = date.getDay()

    return weekend || !(day === 0 || day === 6)
  }, [weekend])

  const addWeekdays = () => {
  if (!startDate) return undefined

  let resultDate = dayjs(startDate)
  if (type.max_days > 0) {
    let remainingDays = type.max_days - 1

    while (remainingDays > 0) {
      resultDate = resultDate.add(1, 'day')
      if (!type.weekend_reflectable) {
        if (resultDate.day() !== 0 && resultDate.day() !== 6) {
          remainingDays--
        }
      } else {
        remainingDays--
      }
    }

    return resultDate.toDate()
  }

  return undefined
}


  return (
    <Box>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        selected={startDate}
        onChange={handleOnChange}
        minDate={dayjs().add(type.before_days, 'day').toDate()}
        maxDate={
          type.id === 2 || type.title?.toLowerCase() === 'sick leave'
            ? new Date()
            : type.id === 5
            ? dayjs().add(14, 'day').toDate()
            : emergency
            ? undefined
            : addWeekdays()
        }
        filterDate={handleExcludedDates}
        open={isOpen}
        onInputClick={() => setIsOpen(true)}
        onClickOutside={() => setIsOpen(false)}
        className='text-center date-picker-reports'
        dropdownMode='select'
        portalId='demo-space-x'
        popperPlacement={popperPlacement}
        customInput={
          <CustomInput
            label='Date'
            start={startDate as Date | number}
            end={endDate as Date | number}
          />
        }
      />
    </Box>
  )
}


export default PickersRange
