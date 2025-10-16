import '@/Views/Shared/_Layout.cshtml.ts';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("click-btn").addEventListener("click", () => {
    Swal.fire({
      title: "Good job!",
      text: "You clicked the button!",
      icon: "success"
    });
  });
})
