import React from 'react'
import { ConfigProvider as AntdConfigProvider, Grid } from 'antd'

import en from 'antd/lib/locale/en_GB'
import it from 'antd/lib/locale/it_IT'
const antdLocales = { en, it }



/**
 * @const MatildaContext
 */
export const MatildaContext = React.createContext()

/**
 * @function MatildaProvider
 * @param {*} props 
 * @returns 
 */
export function MatildaProvider (props) {
  const { i18n, config, router, session } = props
  const breakpoints = Grid.useBreakpoint()

  const getTranslation = (key) => {
    return i18n.translations[key] || key
  }

  const getAvailableLocales = () => {
    return i18n.available_locales
  }

  const getLocale = () => {
    return i18n.locale
  }

  const getConfig = (key) => {
    return config[key] || null
  }

  const getRoute = (key) => {
    return router.routes[key] || null
  }

  const getSession = () => {
    return session
  }

  const value = {
    getTranslation,
    getAvailableLocales,
    getLocale,
    getConfig,
    getRoute,
    getSession,
    responsive: {
      isMobile: breakpoints.xs && !breakpoints.sm,
      isTablet: breakpoints.sm && !breakpoints.md,
      isDesktop: breakpoints.md
    }
  }

  return (
    <MatildaContext.Provider value={value}>
      {props.children}
    </MatildaContext.Provider>
  )
}

/**
 * @function MatildaContainer
 * @param {*} props 
 * @returns 
 */
export function MatildaContainer (props) {
  const matilda = props.matilda || {}

  return (
    <MatildaProvider {...matilda}>
      <AntdConfigProvider locale={antdLocales[matilda.i18n.locale] || en}>
        {props.children}
      </AntdConfigProvider>
    </MatildaProvider>
  )
}
