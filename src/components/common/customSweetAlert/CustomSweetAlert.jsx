// CustomSweetAlert.js
import Swal from "sweetalert2";

const customSwalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger",
  },
  buttonsStyling: true,
  cancelButtonColor: "#dc3545",
  confirmButtonColor: "#28a745",
  showCloseButton: true,
});

const CustomSweetAlert = (
  title,
  text,
  icon = "warning",
  showCancelButton = true,
  confirmButtonText,
  cancelButtonText,
  callback
) => {
  const buttons = showCancelButton
    ? {
      showCancelButton: true,
      confirmButtonText: confirmButtonText ? confirmButtonText : "Yes, delete it!",
      cancelButtonText: cancelButtonText ? cancelButtonText : "No, cancel!",
    }
    : {
      confirmButtonText: "OK",
    };

  return customSwalWithBootstrapButtons
    .fire({
      title,
      text,
      icon,
      reverseButtons: true,
      ...buttons,
    })
    .then((result) => {
      if (callback && typeof callback === "function") {
        callback(result);
      }
    });
};

export default CustomSweetAlert;
