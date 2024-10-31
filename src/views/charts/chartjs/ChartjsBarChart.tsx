// ** React Imports
import {  useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'
import { ChartOptions } from 'chart.js'

// ** Types
import { get } from 'src/handler/request.handler'
import authConfig from 'src/configs/auth'
import { CircularProgress, Grid } from '@mui/material'

interface BarProp {
  yellow: string
  labelColor: string
  borderColor: string
  title: string
  url: string
}
type ChartType = {
  name: string[]
  count: string[]
}

const ChartjsBarChart = (props: BarProp) => {
  // ** Props
  const { yellow, labelColor, borderColor, title, url } = props

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    indexAxis: 'x',
    scales: {
      x: {
        stacked:true,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        stacked:true,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor
        },
        ticks: {
          stepSize: 100,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const [data, setData] = useState<ChartType>({
    name: [],
    count: []
  })
  const [loading, setLoading] = useState(false)

  const init = async () => {
    setLoading(true)
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
    const res = await get(url, storedToken)
    if (res && res.status_code == 200) {
      setLoading(false)
      setData(res.data)
    } else {
      setLoading(false)
    }
  }
  useEffect(() => {
    init()
  }, [])

  return (
    <Card>
      <CardHeader
        title={title}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
     
      />
      <CardContent>
        {!loading ? (
          <Bar
            data={{
              labels: data?.name,
            
              datasets: [
                {
                  maxBarThickness: 15,
                  minBarLength: 5,
                  backgroundColor: yellow,
                  borderColor: 'transparent',
                  borderRadius: { topRight: 15, topLeft: 15 },
                  data: data?.count,
                }
              ]
            }}
            height={500}
            options={options}
          />
        ) : (
          <Grid display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <CircularProgress disableShrink sx={{ mt: 6 }} />
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

export default ChartjsBarChart
