import Swal from "sweetalert2";

let showAlert = (message, status, callback) => {
  Swal.fire({
    text: message,
    icon: status,
    heightAuto: false,
    buttonsStyling: false,
    confirmButtonText: "موافقه",
    customClass: { confirmButton: "btn btn-primary" },
  }).then((result) => {
    if (result.isConfirmed && typeof callback === "function") {
      callback();
    }
  });
};
export default showAlert;
