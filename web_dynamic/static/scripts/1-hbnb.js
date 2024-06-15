/*
listens for change events on checkboxes and updates
the displayed list of selected amenities.
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
});
