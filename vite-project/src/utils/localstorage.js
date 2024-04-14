const saveTokenToLocalstorage = (token) => {
    localStorage.setItem("accessToken", token);
}

const removeTokenFromLocalstorage = (token) => {
    localStorage.removeItem('accessToken');
}

const getTokenFromLocalstorage = () => {
    const token = localStorage.getItem("accessToken");
    return token;
}

const saveUserToLocalstorage = (user) => {
    localStorage.setItem("user", JSON.stringify(user))
}

const removeUserFromLocalstorage = () => {
    localStorage.removeItem("user")
}
const getUserFromLocalstorage = () => {
    const userString = localStorage.getItem("user")

    if (!userString) {
        return {}
    }
    const user = JSON.parse(userString)
    return user
}

export {
    saveTokenToLocalstorage,
    removeTokenFromLocalstorage,
    getTokenFromLocalstorage,
    saveUserToLocalstorage,
    removeUserFromLocalstorage,
    getUserFromLocalstorage
}