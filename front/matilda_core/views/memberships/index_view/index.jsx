import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import NavigatorComponent from 'matilda_core/components/NavigatorComponent'
import IndexPage from './pages/IndexPage'
import ManagePage from './pages/ManagePage'
import InviteDrawer from './drawers/InviteDrawer'
import EditPermissionsDrawer from './drawers/EditPermissionsDrawer'

const navigatorRoutes = [
  {
    key: 'index',
    label: 'titles.users_list',
    pages: [
      {
        key: 'index_page',
        label: 'titles.users_list',
        component: IndexPage,
        drawers: [
          {
            key: 'invite_drawer',
            label: 'titles.invite_user',
            component: InviteDrawer,
            size: 'medium'
          }
        ]
      },
      {
        key: 'manage_page',
        label: 'titles.manage_user',
        component: ManagePage,
        drawers: [
          {
            key: 'edit_permissions_drawer',
            label: 'titles.edit_permissions',
            component: EditPermissionsDrawer,
            size: 'medium'
          }
        ]
      },
    ]
  }
]

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent
        siderActiveKey='matilda_core.memberships'
      >
        <NavigatorComponent
          routes={navigatorRoutes}
        />
      </LayoutComponent>
    </MatildaContainer>
  )
}
