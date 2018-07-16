import axios from "axios";

export default {
  getAllSaved: () => {
    return axios.get("/api/activity");
  },
  saveData: data => {
    return axios.post("/api/activity", data);
  },
  viewSavedByType: type => {
    return axios.get("/api/activity/:id/" + type);
  },
  viewSavedByID: id => {
    return axios.get(`/api/activity/${id}`);
  },
  deleteSavedID: id => {
    return axios.delete(`/api/activity/${id}`);
  },
  getCurrentUser: () => {
    return axios.get("/api/current_user");
  },
  getLocation: () => {
    return axios.get("/locate");
  },
  loginWithUber: () => {
    return axios.get("/api/uber/login");
  },
  viewUberPrices: (startLat, startLong, endLat, endLong) => {
    return axios.get(
      `/api/uber/estimate/${startLat}/${startLong}/${endLat}/${endLong}`
    );
  },
  requestUberRide: (startLat, startLong, endLat, endLong, fareId) => {
    return axios.get(
      `/api/uber/request/${startLat}/${startLong}/${endLat}/${endLong}/${fareId}`
    );
  }
};
