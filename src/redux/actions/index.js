// Log In
export const logIn = (state) => {
  return (dispatch) => {
    dispatch({
      type: "logIn",
      payload: state,
    })
  }
}

// Log Out
export const logOut = (state) => {
  return (dispatch) => {
    dispatch({
      type: "logOut",
      payload: state,
    })
  }
}
