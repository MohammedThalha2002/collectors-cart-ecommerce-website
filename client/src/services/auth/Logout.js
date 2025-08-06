export function logOut() {
  localStorage.removeItem("jwt-token");
  localStorage.removeItem("collectorscart-delivery-address");
}
