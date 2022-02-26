import React, { useMemo, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu } from 'antd'
import * as Icons from '@ant-design/icons'
import { MatildaContext } from '../index'
import useRequestHook from '../hooks/useRequestHook'

/**
 * @function LayoutComponent
 * @param {*} props 
 * @returns 
 */
export default function LayoutComponent (props) {
  const { theme, siderActiveKey, siderCollapsed, siderTheme } = props
  const { responsive: { isMobile } } = useContext(MatildaContext)
  const [menuCollapsed, setMenuCollapsed] = useState(siderCollapsed || isMobile)

  const showSider = useMemo(() => {
    return isMobile || theme == 'default'
  }, [theme, isMobile])

  const contentStyle = useMemo(() => {
    let paddingLeft = 0
    if (showSider) paddingLeft = menuCollapsed ? 70 : (isMobile ? 70 : 220)
    let contentStyle = { minHeight: '100vh', padding: 15, paddingTop: 80, paddingLeft: paddingLeft }

    if (theme == 'clean-centered') {
      contentStyle = Object.assign(contentStyle, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      })
    }

    return contentStyle
  }, [theme, menuCollapsed, showSider])

  useEffect(() => {
    if (isMobile && !menuCollapsed) {
      setMenuCollapsed(true)
    }
  }, [isMobile])

  return (
    <Layout>
      <Header menuCollapsed={menuCollapsed} setMenuCollapsed={setMenuCollapsed} />

      <Layout>
        {showSider && <Sider siderActiveKey={siderActiveKey} siderTheme={siderTheme || 'light'} collapsed={menuCollapsed} onCollapsedChange={setMenuCollapsed} />}
        <Layout.Content style={contentStyle}>
          {props.children}
        </Layout.Content>
      </Layout>

      <Footer />
    </Layout>
  )
}

LayoutComponent.propTypes = {
  theme: PropTypes.oneOf(['default', 'clean', 'clean-centered']).isRequired,
  siderActiveKey: PropTypes.string
}

LayoutComponent.defaultProps = {
  theme: 'default'
}

/***************************************************************************************************** */

function Header (props) {
  const { menuCollapsed, setMenuCollapsed } = props
  const { getConfig, responsive: { isMobile } } = useContext(MatildaContext)
  const logo = getConfig('global_logo')
  const title = getConfig('global_title')

  const toggleMenu = () => setMenuCollapsed(!menuCollapsed)

  return (
    <Layout.Header style={{ position: 'fixed', zIndex: 999, width: '100%' }}>
      <div style={{ float: 'left', color: '#fff', textTransform: 'uppercase', fontWeight: 20 }}>
        {logo ? (
          <img src={logo} alt={title} title={title} style={{ height: 40 }} />
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div style={{ float: 'right' }}>
        {isMobile ? <MenuMobile toggleMenu={toggleMenu} /> : <MenuSecondary />}
      </div>
    </Layout.Header>
  )
}

function Footer () {
  const { getConfig } = useContext(MatildaContext)
  const footer = getConfig('global_footer')

  return (
    <Layout.Footer style={{ textAlign: 'center' }}>{footer}</Layout.Footer>
  )
}

function Sider (props) {
  const { siderActiveKey, siderTheme, collapsed, onCollapsedChange } = props
  const { responsive: { isMobile } } = useContext(MatildaContext)

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapsedChange}
      defaultCollapsed
      width={200}
      collapsedWidth={55}
      theme={siderTheme}
      style={{ position: 'fixed', top: 64, height: `calc(100% - 64px)`, zIndex: 999 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <MenuPrimary activeKey={siderActiveKey} theme={siderTheme} />
        {isMobile && <MenuSecondary theme={siderTheme} />}
      </div>
    </Layout.Sider>
  )
}

function MenuPrimary (props) {
  const { activeKey, theme } = props
  const { getConfig, getTranslation, getSession } = useContext(MatildaContext)
  const session = getSession()

  const sidebarItems = useMemo(() => {
    let items = []
    if (session) {
      // filter permissions
      items = getConfig('sidebar_items').filter((i) => !i.permission || (session.group_permissions && session.group_permissions.includes(i.permission)))
      // order by index
      items = items.sort((a, b) => a.index - b.index)
      // update labels
      items = items.map((i) => { i.label = getTranslation(i.label); return i })
    }

    return items
  }, [session])

  const onClickUrl = (path) => {
    window.location.replace(path)
  }

  return (
    <Menu theme={theme || 'dark'} mode="vertical" selectedKeys={[activeKey]}>
      {sidebarItems.map((sidebarItem) => {
        const IconItem = sidebarItem.icon ? Icons[sidebarItem.icon] : null
        return (
          <Menu.Item key={sidebarItem.name} icon={IconItem ? <IconItem /> : (sidebarItem.icon ? <div dangerouslySetInnerHTML={{ __html: sidebarItem.icon }} /> : null)} onClick={() => onClickUrl(sidebarItem.url)}>
            {sidebarItem.label}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

function MenuSecondary (props) {
  const { theme } = props
  const { getSession, getTranslation, getRoute, getAvailableLocales, responsive: { isMobile } } = useContext(MatildaContext)
  const session = getSession()
  const availableLocales = getAvailableLocales()
  const request = useRequestHook()

  const onChangeLocale = (newLocale) => {
    request.send('matilda_core.helper_update_session_locale', { locale: newLocale }).then(({ result }) => {
      if (!result) return
      window.location.reload()
    })
  }

  const onClickUrl = (path) => {
    window.location.replace(path.path)
  }

  const onLogout = () => {
    request.send('matilda_core.authentication_logout_action').then(({ result }) => {
      if (!result) return
      window.location.reload()
    })
  }

  return (
    <Menu theme={theme || 'dark'} mode={isMobile ? "inline" : "horizontal"}>
      {session?.user_uuid && (
        <Menu.SubMenu
          key="profile"
          icon={<Icons.UserOutlined />}
          title={getTranslation('header.profile')}
        >
          <Menu.Item
            key={"profile_account_settings"}
            onClick={() => onClickUrl(getRoute('matilda_core.profile_index_view'))}
          >{getTranslation('header.account_settings')}</Menu.Item>
          <Menu.Item
            key={"profile_groups"}
          >{getTranslation('header.groups')}</Menu.Item>
          <Menu.Item
            key={"profile_logout"}
            onClick={() => onLogout()}
          >
            {getTranslation('header.logout')}
          </Menu.Item>
        </Menu.SubMenu>
      )}
      <Menu.SubMenu
        key="language"
        icon={<Icons.FlagOutlined />}
        title={getTranslation('header.lang')}
      >
        {availableLocales.map((availableLocale) => {
          return (
            <Menu.Item
              key={availableLocale}
              onClick={() => onChangeLocale(availableLocale)}
            >{availableLocale.toUpperCase()}</Menu.Item>
          )
        })}
      </Menu.SubMenu>
    </Menu>
  )
}

function MenuMobile (props) {
  const { toggleMenu } = props

  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item
        key={"toggle"}
        icon={<Icons.MenuOutlined />}
        onClick={toggleMenu}
        title={'Menu'}
      >Menu</Menu.Item>
    </Menu>
  )
}