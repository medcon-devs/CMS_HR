// ** React Import
import { useEffect, useRef, useState } from 'react'

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// ** Types
import { CalendarType } from 'src/types/apps/calendarTypes'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'

const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    calendar: '',
    guests: [],
    location: '',
    description: ''
  }
}

const Calendar = (props: CalendarType) => {
  // ** Props
  const {
    dispatch,
    direction,
    updateEvent,
    calendarsColor,
    setCalendarApi,
    handleSelectEvent,
    handleAddEventSidebarToggle,
    loadData
  } = props

  // ** Refs
  const calendarRef = useRef<FullCalendar | null>(null)

  const [events, setEvents] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async (startDate: Date, endDate: Date) => {
    setLoading(true)
    const startDayWeek = startDate
    const endDayWeek = endDate
    const from = new Date(startDayWeek).toISOString().split('T')[0]
    const to = new Date(endDayWeek).toISOString().split('T')[0]
    const res = await loadData(from, to)

    setLoading(false)
    setEvents(res)
  }

  useEffect(() => {
    if (calendarRef.current) {
      // @ts-ignore
      setCalendarApi(calendarRef.current.getApi())
      const calendarApi = calendarRef.current.getApi()
      const handleDatesSet = (dateInfo: any) => {
        // Fetch data from API based on the new date range
        fetchData(dateInfo.start, dateInfo.end)
      }

      // Add event listener for date range change
      calendarApi.on('datesSet', handleDatesSet)
      const startDate = calendarApi.view.activeStart
      const endDate = calendarApi.view.activeEnd

      // Initial data fetch
      fetchData(startDate, endDate)

      return () => {
        // Remove event listener on component unmount
        calendarApi.off('datesSet', handleDatesSet)
      }
    } else {
      // fetchData()
    }
  }, [calendarRef])

  const calendarOptions = {
    displayEventEnd: true,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',

    headerToolbar: {
      start: 'LeftArrow,RightArrow',
      center: 'title',
      right: ''
    },

    /*
      Enable dragging and resizing event
      ? Docs: https://fullcalendar.io/docs/editable
    */
    editable: true,

    /*
      Enable resizing event from start
      ? Docs: https://fullcalendar.io/docs/eventResizableFromStart
    */
    eventResizableFromStart: true,

    /*
      Automatically scroll the scroll-containers during event drag-and-drop and date selecting
      ? Docs: https://fullcalendar.io/docs/dragScroll
    */
    dragScroll: true,

    /*
      Max number of events within a given day
      ? Docs: https://fullcalendar.io/docs/dayMaxEvents
    */
    dayMaxEvents: 4,

    /*
      Determines if day names and week names are clickable
      ? Docs: https://fullcalendar.io/docs/navLinks
    */
    navLinks: true,

    eventClassNames({ event: calendarEvent }: any) {
      // @ts-ignore
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]

      return [
        // Background Color
        `bg-${colorName}`
      ]
    },

    dateClick(info: any) {
      const ev = { ...blankEvent }
      ev.start = info.date
      ev.end = info.date
      ev.allDay = true

      // @ts-ignore
      dispatch(handleSelectEvent(ev))
      handleAddEventSidebarToggle()
    },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    eventDrop({ event: droppedEvent }: any) {
      dispatch(updateEvent(droppedEvent))
    },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }: any) {
      dispatch(updateEvent(resizedEvent))
    },

    customButtons: {
      LeftArrow: {
        text: 'Prev',
        icon: 'chevron-left',
        click: async () => {
          if (calendarRef.current) {
            const api = calendarRef.current.getApi()
            api.prev()
          }
        }
      },
      RightArrow: {
        text: 'Next',
        icon: 'chevron-right',
        click: async () => {
          if (calendarRef.current) {
            const api = calendarRef.current.getApi()
            api.next()
          }
        }
      }
    },

    ref: calendarRef,

    // Get direction from app state (store)
    direction
  }

  return loading ? (
    <Box sx={{ width: 1, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <FullCalendar {...calendarOptions} events={events} eventContent={renderEventContent} />
  )
}
function renderEventContent(eventInfo: any) {
  return (
    <Grid>
      <Grid display={'flex'}>
        <Typography color={'white'} variant='caption'>
          {eventInfo.event.extendedProps.type} -
        </Typography>
        <Typography color={'white'} fontWeight={'bold'} fontStyle={'italic'} variant='caption'>
          {eventInfo.event.title}
        </Typography>
      </Grid>
    </Grid>
  )
}
export default Calendar
