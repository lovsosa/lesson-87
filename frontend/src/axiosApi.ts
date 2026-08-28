import axios from "axios"
import {BASE_URL} from "./constants.ts";

const axiosApi = axios.create({
  baseURL: BASE_URL,
})

export default axiosApi