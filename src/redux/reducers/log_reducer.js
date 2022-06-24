// Wallet
let initialState = {
  logined: false,
  userinfo: null
};
if (window.localStorage.getItem("trustlog"))
  initialState = JSON.parse(window.localStorage.getItem("trustlog"))

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "logIn":
      window.localStorage.setItem("trustlog", JSON.stringify({
        logined: true,
        userinfo: action.payload.userinfo,
      }))
      return {
        logined: true,
        userinfo: action.payload.userinfo,
      }
    case "logOut":
      window.localStorage.removeItem("trustlog")
      return {
        logined: false,
        userinfo: null
      }
    default:
      return state;
  }
};

export default reducer;
