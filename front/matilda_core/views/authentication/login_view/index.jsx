import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import LoginPage from './pages/LoginPage'

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent theme='clean-centered'>
        <LoginPage />
      </LayoutComponent>
    </MatildaContainer>
  )
}
