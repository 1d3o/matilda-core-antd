import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { PageHeader, Button, Dropdown, Menu } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { MatildaContext } from '../'

 export default function NavigatorWrapperComponent (props) {
  const { navigator, menu, extra } = props
  const { prevPageKey } = navigator.currentPageData
  const { getTranslation } = useContext(MatildaContext)
  const title = getTranslation(navigator.currentPage.label)
  
  const onClickBack = () => {
    if (prevPageKey) {
      navigator.goToPage(prevPageKey, {}, true)
    }
  }

  const renderMenu = () => {
    return (
      <Menu>
        {menu.map((menuItem, index) => {
          if (!menuItem) return null

          return (
            <Menu.Item key={index} style={{ minWidth: 150 }}>
              <a onClick={menuItem.onClick}>{menuItem.label}</a>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }

  const renderExtra = () => {
    if (extra) return extra
    if (!menu) return null

    return (
      <Dropdown overlay={renderMenu}>
        <Button type="primary">
          <MenuOutlined />
        </Button>
      </Dropdown>
    )
  }

  return (
    <PageHeader
      title={title}
      extra={renderExtra()}
      onBack={onClickBack}
    >
      {props.children}
    </PageHeader>
  )
}

NavigatorWrapperComponent.propTypes = {
  navigator: PropTypes.object.isRequired,
  menu: PropTypes.array,
  extra: PropTypes.any
}

NavigatorWrapperComponent.defaultProps = {
  menu: null,
  extra: null
}