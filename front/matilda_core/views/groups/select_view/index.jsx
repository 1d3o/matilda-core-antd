import React from 'react'
import { MatildaContainer } from 'matilda_core'
import LayoutComponent from 'matilda_core/components/LayoutComponent'
import SelectPage from './pages/SelectPage'

export default (props) => {
  return (
    <MatildaContainer {...props}>
      <LayoutComponent theme='clean-centered'>
        <SelectPage {...props} />
      </LayoutComponent>
    </MatildaContainer>
  )
}
