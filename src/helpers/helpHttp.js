export const helpHttp = () => {
  const customFetch = (endpoint, options) => {
    const defaultHeader = {
      accept: 'application/json'
    }

    // Abortar el fetch si demora en responder
    const controller = new AbortController()
    options.signal = controller.signal

    options.method = options.method || 'GET'

    options.headers = options.headers
      ? { ...defaultHeader, ...options.headers }
      : defaultHeader

    options.body = JSON.stringify(options.body) || false
    if (!options.body) delete options.body

    // Si demora 5 seg se aborta la peticion
    setTimeout(() => {
      controller.abort()
    }, 5000)

    return fetch(endpoint, options)
      .then(res => res.ok
        ? res.json()
        // eslint-disable-next-line prefer-promise-reject-errors
        : Promise.reject({
          err: true,
          status: res.status || '00',
          statusText: res.statusText || 'Ocurrió un error'
        }))
      .catch(err => err)
  }

  const get = (url, options = {}) => customFetch(url, options)

  const post = (url, options) => {
    options.method = 'POST'
    return customFetch(url, options)
  }

  const put = (url, options) => {
    options.method = 'PUT'
    return customFetch(url, options)
  }

  const del = (url, options) => {
    options.method = 'DEL'
    return customFetch(url, options)
  }

  return {
    get,
    post,
    put,
    del
  }
}
