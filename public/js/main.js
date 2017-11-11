$(function() {
  $(".button-collapse").sideNav()
  $(".parallax").parallax()

  $(".skillbar").each(function() {
    $(this)
      .find(".skillbar-bar")
      .animate(
        {
          width: $(this).attr("data-percent")
        },
        6000
      )
  })
}) // end of document ready
