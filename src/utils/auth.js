const isBrowser = typeof window !== `undefined`

export const setUser = user => (window.localStorage.purifyUser = JSON.stringify(user));

const getUser = () => {
  if (window.localStorage.purifyUser !== "null") 
  {
    let user = JSON.parse(window.localStorage.purifyUser)
    console.log(user);
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

export const getExpiration = () => isBrowser && JSON.parse(window.localStorage.getItem('purifyUser')).expiration;

export const getSSOExpiration = () => isBrowser && window.localStorage.getItem('SSO-Expiration');

export const logout = callback => {
    if (!isBrowser) return
    setUser({})
    callback()
  }