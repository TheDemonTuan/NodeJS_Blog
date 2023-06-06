$(document).ready(function () {

  $(window).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $("#tdt-navbar").addClass("fixed-top");
    } else {
      $("#tdt-navbar").removeClass("fixed-top");
    }
  });

  // Sign in
  $("#sign-in").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      data: $(this).serialize(),
    })
      .done(function (data) {
        //console.log(data);
        if (data.status == "success") {
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: data.status,
            title: data.message,
          });
        }
      })
      .fail(function (jqXHR, textStatus, err) {
        console.log(err);
      });
  });

  // Sign up
  $("#sign-up").on("submit", function (event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      data: $(this).serialize(),
    })
      .done(function (data) {
        //console.log(data);
        Swal.fire({
          icon: data.status,
          title: data.message,
        });
        if (data.status == "success") {
          $("#sign-up")[0].reset();
        }
      })
      .fail(function (jqXHR, textStatus, err) {
        console.log(err);
      });
  });
});
