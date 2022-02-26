import { useContext, useState } from 'react'
import { MatildaContext } from '../index'
import useRouterHook from '../hooks/useRouterHook'

export default function useRequestHook(props = {}) {
  const { errorMessage } = props
  const { getTranslation } = useContext(MatildaContext)
  const [loading, setLoading] = useState(false)
  const router = useRouterHook()

  /**
   * @function onResponseSuccess
   * @param {*} response 
   * @param {*} resolve 
   */
  const onResponseSuccess = (response, resolve) => {
    setLoading(false)
    resolve(response)
  }

  /**
   * @function onResponseError
   * @param {*} error 
   * @param {*} resolve 
   */
  const onResponseError = (error, resolve) => {
    setLoading(false)
    resolve({ result: false, errors: [{ message: getTranslation(errorMessage || 'messages.general_error') }] })
  }

  /**
   * @function send
   * @param {*} routeKey 
   * @param {*} params 
   * @returns 
   */
  const send = (routeKey, params = {}) => {
    if (loading) return new Promise((resolve) => resolve(false))

    setLoading(true)

    // find route object
    const routeObject = router.get(routeKey)

    // generate request url
    let url = routeObject.path
    if (routeObject.method == 'GET') {
      url = `${url}?`
      Object.entries(params).map(([key, value]) => url = `${url}${key}=${value}&`)
    }

    // generate fetch options
    let fetchOptions = {
      method: routeObject.method,
      body: routeObject.method == 'GET' ? null : JSON.stringify(params),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    }

    // run request
    return new Promise((resolve, reject) => {
      fetch(url, fetchOptions).then((response) => {
        return response.json()
      }).then((response) => {
        return onResponseSuccess(response, resolve)
      }).catch((error) => {
        return onResponseError(error, resolve)
      })
    })
  }

  return { send, loading }
}