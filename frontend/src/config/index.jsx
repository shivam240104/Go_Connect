const {default : axios} = require("axios")

export const BaseURL = "https://go-connect-ymlq.onrender.com/"

export const clientServer = axios.create({
    baseURL :BaseURL,
})