import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import RecoverPasswordPage from './pages/RecoverPasswordPage'

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent theme='clean-centered'>
        <RecoverPasswordPage />
      </LayoutComponent>
    </MatildaContainer>
  )
}
