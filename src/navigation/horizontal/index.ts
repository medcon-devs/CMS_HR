// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
 
    {
      title: 'Charts',
      icon: 'mdi:chart-donut',
      children: [
        {
          title: 'Apex',
          icon: 'mdi:chart-line',
          path: '/charts/apex-charts'
        },
        {
          title: 'Recharts',
          icon: 'mdi:chart-bell-curve-cumulative',
          path: '/charts/recharts'
        },
        {
          title: 'ChartJS',
          path: '/charts/chartjs',
          icon: 'mdi:chart-bell-curve'
        }
      ]
    },
  
  ]
}

export default navigation
