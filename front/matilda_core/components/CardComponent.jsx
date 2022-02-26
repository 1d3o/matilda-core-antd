import React from 'react'
import PropTypes from 'prop-types'
import { Card, Spin, Dropdown, Button, Menu } from 'antd'
import { MoreOutlined } from '@ant-design/icons'

export default function CardComponent (props) {
  const { content, contentDependOn, menu, menuDependOn } = props
  const cardProps = Object.assign({}, props)
  delete cardProps.content
  delete cardProps.contentDependOn
  delete cardProps.menu
  delete cardProps.menuDependOn

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
    if (!menu) return null

    return (
      <Dropdown overlay={renderMenu}>
        <Button type="primary" ghost>
          <MoreOutlined />
        </Button>
      </Dropdown>
    )
  }

  return (
    <Card
      extra={!!menuDependOn ? renderExtra() : null}
      {...cardProps}
    >
      {!!contentDependOn ? content(contentDependOn) : <div style={{ textAlign: 'center' }}><Spin /></div>}
    </Card>
  )
}

CardComponent.propTypes = {
  content: PropTypes.func.isRequired,
  contentDependOn: PropTypes.any,
  menu: PropTypes.array,
  menuDependOn: PropTypes.any
}

CardComponent.defaultProps = {
  contentDependOn: true,
  menuDependOn: true
}