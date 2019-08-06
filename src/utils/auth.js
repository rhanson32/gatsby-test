const isBrowser = typeof window !== `undefined`

export const setUser = user => (window.localStorage.gatsbyUser = JSON.stringify(user));

const getUser = () => {
  if (window.localStorage.gatsbyUser) {
    let user = JSON.parse(window.localStorage.gatsbyUser)
    return user ? user : {}
  }
  if(window.localStorage.SSO-User)
  {
    let user = {
      username: window.localStorage.SSO-user
    }
    return user ? user : {}
  }
  return {}
}

export const isLoggedIn = () => {
    if (!isBrowser) return false
  
    const user = getUser()
    if (user) return !!user.username
  }
  
export const getCurrentUser = () => isBrowser && getUser()

export const setExpiration = (date) => isBrowser && (window.localStorage.expirationDate = date)

export const getExpiration = () => isBrowser && window.localStorage.getItem('expirationDate');

export const getSSOExpiration = () => isBrowser && window.localStorage.getItem('SSO-Expiration');

export const logout = callback => {
    if (!isBrowser) return
    setUser({})
    callback()
  }