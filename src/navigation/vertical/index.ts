// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

const Navigation = (): VerticalNavItemsType => {
  const auth = useAuth()

  return auth.user?.role == 'admin'
    ? [
        {
          title: 'Request Type',
          icon: 'mdi:shape',
          path: '/leave-type'
        },
        {
          title: 'Request Leave',
          icon: 'mdi:list-box-outline',
          path: '/request-leave'
        },
        {
          title: 'Users',
          icon: 'mdi:user',
          path: '/users'
        }
      ]
    : [
        {
          title: 'Request Leave',
          icon: 'mdi:list-box-outline',
          path: '/request-leave'
        }
      ]
}

export default Navigation

