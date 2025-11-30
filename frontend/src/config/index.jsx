const {default : axios} = require("axios")

export const BaseURL = "http://localhost:9090"

export const clientServer = axios.create({
    baseURL :BaseURL,
})