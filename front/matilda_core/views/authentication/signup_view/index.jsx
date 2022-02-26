import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import SignupPage from './pages/SignupPage'

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent theme='clean-centered'>
        <SignupPage />
      </LayoutComponent>
    </MatildaContainer>
  )
}
