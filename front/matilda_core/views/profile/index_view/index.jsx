import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import NavigatorComponent from 'matilda_core/components/NavigatorComponent'
import IndexPage from './pages/IndexPage'
import EmailsPage from './pages/EmailsPage'
import CredentialsPage from './pages/CredentialsPage'
import AddEmailDrawer from './drawers/AddEmailDrawer'

const navigatorRoutes = [
  {
    key: 'index',
    label: 'titles.profile_manage',
    pages: [
      {
        key: 'index_page',
        label: 'titles.profile_manage',
        component: IndexPage,
        drawers: []
      },
    ]
  },
  {
    key: 'emails',
    label: 'titles.profile_emails_manage',
    pages: [{
      key: 'emails_page',
      label: 'titles.profile_emails_manage',
      component: EmailsPage,
      drawers: [
        {
          key: 'add_email_drawer',
          label: 'titles.add_email_address',
          component: AddEmailDrawer,
          size: 'medium'
        }
      ]
    }],
  },
  {
    key: 'credentials',
    label: 'titles.profile_credentials_manage',
    pages: [{
      key: 'credentials_page',
      label: 'titles.profile_credentials_manage',
      component: CredentialsPage,
      drawers: []
    }],
  }
]

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent>
        <NavigatorComponent routes={navigatorRoutes} />
      </LayoutComponent>
    </MatildaContainer>
  )
}
