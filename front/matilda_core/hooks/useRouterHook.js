import { useContext, useState } from 'react'
import { MatildaContext } from '../index'

export default function useRouterHook() {
  const { getRoute } = useContext(MatildaContext)

  /**
   * @function get
   * @param {*} routeKey 
   * @returns 
   */
  const get = (routeKey) => {
    const routeObject = getRoute(routeKey)
    if (routeObject) return routeObject

    if (typeof routeKey == 'object') {
      return routeKey
    } else if (typeof routeKey == 'string') {
      return { path: routeKey, method: 'GET' }
    } else {
      throw new Error('routeKey not valid. It should be a string or an object with keys :path and :method.')
    }
  }

  return { get }
}