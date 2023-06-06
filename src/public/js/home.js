$(document).ready(function () {

  $(window).scroll(function () {
    if ($(this).scrollTop() > 0) {
      $("#tdt-navbar").addClass("fixed-top");
    } else {
      $("#tdt-navbar").removeClass("fixed-top");
    }
  });
});
