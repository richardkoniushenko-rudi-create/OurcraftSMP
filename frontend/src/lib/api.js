import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const fetchServerInfo = () => axios.get(`${API}/server/info`).then((r) => r.data);
export const fetchServerStatus = () => axios.get(`${API}/server/status`).then((r) => r.data);
export const fetchDiscordInfo = () => axios.get(`${API}/discord/info`).then((r) => r.data);
export const fetchDiscordChat = (limit = 20) =>
  axios.get(`${API}/discord/chat`, { params: { limit } }).then((r) => r.data);
