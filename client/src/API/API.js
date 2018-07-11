import axios from "axios";

export default {
  getAllSaved: function() {
    return axios.get("/api/activity");
  },
  saveData: function(data) {
    return axios.post("/api/activity", data);
  },
  viewSavedByType: function(type) {
    return axios.get("/api/activity/:id/" + type);
  },
  viewSavedByID: function(id) {
    return axios.get(`/api/activity/${id}`);
  },
  deleteSavedID: function(id) {
    return axios.delete(`/api/activity/${id}`);
  },
  getCurrentUser: function() {
    return axios.get("/api/current_user");
  },
  getLocation: function() {
    return axios.get("/locate");
  }
};
