import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import UpdatePasswordPage from './pages/UpdatePasswordPage'

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent theme='clean-centered'>
        <UpdatePasswordPage userUuid={props.user_uuid} />
      </LayoutComponent>
    </MatildaContainer>
  )
}
