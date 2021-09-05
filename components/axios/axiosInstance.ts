import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
axios.defaults.withCredentials = true;

console.log(process.env.NEXT_PUBLIC_SERVER_BASE_URL)

export default axios;