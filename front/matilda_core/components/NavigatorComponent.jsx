import React, { useMemo, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Drawer } from 'antd'
import { MatildaContext } from '../index'

/**
 * @function NavigatorComponent
 * @param {*} props
 */
export default function NavigatorComponent (props) {
  const { routes, props: defaultProps } = props
  const { getTranslation, responsive: { isDesktop } } = useContext(MatildaContext)
  const [currentPageData, setCurrentPageData] = useState({ routeKey: routes[0].key, pageKey: null, prevPageKey: null, props: defaultProps })
  const [currentDrawerData, setCurrentDrawerData] = useState(null)

  const currentRoute = useMemo(() => {
    const findCurrentRoute = (routes) => {
      let currentRoute = null

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        if (route.key == currentPageData.routeKey) {
          currentRoute = route
          break
        }

        if (route.routes) {
          currentRoute = findCurrentRoute(route.routes)
          if (currentRoute) break
        }
      }

      return currentRoute
    }

    return findCurrentRoute(routes)
  }, [currentPageData, routes])

  const currentPage = useMemo(() => {
    const currentPage = currentRoute.pages.filter((p) => p.key == currentPageData.pageKey)[0]
    return currentPage || currentRoute.pages[0]
  }, [currentPageData, routes])
  
  const currentDrawer = useMemo(() => {
    if (!currentDrawerData || !currentPage.drawers) return

    return currentPage.drawers.filter((d) => d.key == currentDrawerData.key)[0]
  }, [currentDrawerData, routes])

  const drawerWidth = useMemo(() => {
    const drawerSizesMap = { large: 768, medium: 568, small: 368 }
    if (!isDesktop) return '100%'

    return drawerSizesMap[currentDrawer?.size] || drawerSizesMap.medium
  }, [currentDrawer, isDesktop])

  /**
   * @function goToRoute
   * @param {*} routeKey 
   * @param {*} props 
   */
   const goToRoute = (routeKey, props = {}) => {
    setCurrentPageData({ routeKey: routeKey, pageKey: null, props: Object.assign({}, defaultProps, props) })
    setCurrentDrawerData(null)
  }

  /**
   * @function goToPage
   * @param {*} pageKey
   * @param {*} props 
   * @param {boolean} reset
   */
  const goToPage = (pageKey, props = {}, reset = false) => {
    setCurrentPageData({ routeKey: currentPageData.routeKey, pageKey: pageKey, prevPageKey: reset ? null : currentPage.key, props: Object.assign({}, defaultProps, props) })
    setCurrentDrawerData(null)
  }

  /**
   * @function openDrawer
   * @param {*} drawerKey 
   * @param {*} props 
   */
  const openDrawer = (drawerKey, props = {}) => {
    setCurrentDrawerData({ key: drawerKey, props: Object.assign({}, defaultProps, props) })
  }

  /**
   * @function closeDrawer
   */
  const closeDrawer = () => {
    setCurrentDrawerData(null)
  }

  /**
   * @function renderRoutes
   * @param {*} routes 
   * @returns 
   */
  const renderRoutes = (routes) => {
    const renderRouteSubmenu = (route) => {
      return (
        <Menu.SubMenu key={route.key} title={getTranslation(route.label)}>
          {renderRoutes(route.routes)}
        </Menu.SubMenu>
      )
    }

    return (
      <>
        {routes.map((route) => {
          if (route.routes) return renderRouteSubmenu(route, key)

          return <Menu.Item key={route.key} onClick={() => goToRoute(route.key)}>{getTranslation(route.label)}</Menu.Item>
        })}
      </>
    )
  }

  const navigator = { currentRoute, currentPage, currentPageData, goToRoute, goToPage, openDrawer, closeDrawer }
  return (
    <>
      <Layout style={{ backgroundColor: '#fff' }}>
        {routes.length > 0 && (
          <div>
            <Menu
              mode='horizontal'
              selectedKeys={[currentPageData.routeKey]}
              style={{ height: '100%' }}
            >
              {renderRoutes(routes)}
            </Menu>
          </div>
        )}
        <Layout.Content>
          <div key={currentRoute?.key}>
            <currentPage.component {...currentPageData.props} key={currentPage.key} navigator={navigator} />
          </div>
        </Layout.Content>
      </Layout>

      <Drawer
        title={getTranslation(currentDrawer?.label)}
        placement="right"
        closable={true}
        onClose={() => closeDrawer()}
        visible={!!currentDrawer}
        width={drawerWidth}
      >
        {currentDrawer && <currentDrawer.component {...currentDrawerData?.props} navigator={navigator} />}
      </Drawer>
    </>
  )
}

NavigatorComponent.propTypes = {
  routes: PropTypes.array,
  props: PropTypes.object
}

NavigatorComponent.defaultProps = {
  routes: [],
  props: {}
}