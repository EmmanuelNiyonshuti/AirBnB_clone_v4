/**
 * This script performs two main functions:
 * 1. It listens for change events on checkboxes and updates the displayed list of selected amenities.
 * 2. It performs an AJAX request to check the status of the API and updates the status indicator on the web page.
 */

$(function () {
  const objs = {};
  $('input[type=checkbox]').on('change', function () {
    const name = $(this).data('name');
    const id = $(this).data('id');
    if ($(this).is(':checked')) {
      objs[id] = name;
    } else {
      delete objs[id];
    }
    const ObjLis = Object.values(objs).join(', ');
    $('.amenities h4').text(ObjLis);
  });
  $.ajax({
    url: 'http://localhost:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });
});
