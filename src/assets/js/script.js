jQuery("#carousel").owlCarousel({
  autoplay: true,
  rewind: false,
  margin: 20,
  responsiveClass: true,
  autoHeight: true,
  autoplayTimeout: 7000,
  smartSpeed: 800,
  nav: false,
  responsive: {
    0: {
      items: 1
    },
    600: {
      items: 3
    },
    1024: {
      items: 4
    },
    1366: {
      items: 4
    }
  }
});
