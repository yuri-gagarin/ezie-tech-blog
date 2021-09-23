import axios from "axios";

axios.defaults.baseURL = process.env.NODE_ENV === "production" ? process.env.PRODUCTION_URL : process.env.NEXT_PUBLIC_SERVER_BASE_URL;
axios.defaults.withCredentials = true;

export default axios;