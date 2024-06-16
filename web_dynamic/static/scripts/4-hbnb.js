/**
 * This script handles two main functionalities using jQuery:
 * 1. It listens for changes on checkboxes representing amenities and updates
 *    the displayed list of selected amenities in real-time.
 * 2. It makes AJAX requests to the backend API to check its status and to fetch
 *    a list of places, dynamically updating the webpage with the retrieved data.
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
    $("button").on("click", function() {
        const obj = {}
        $('input[type=checkbox]:checked').each(function () {
            const name = $(this).data('name');
            const id = $(this).data('id');
            obj[id] = name
        });
        const PostData = JSON.stringify({amenities: Object.values(obj)});
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search/",
            contentType: "application/json",
            data: PostData,
            success: function(response) {
                response.forEach(place => {
                    let articleHTML = `
                        <article>
                            <div class="title_box">
                                <h2>${place.name}</h2>
                                <div class="price_by_night">$${place.price_by_night}</div>
                            </div>
                            <div class="information">
                                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                            </div>
                            <div class="description">
                                ${place.description}
                            </div>
                        </article>
                    `;
                    $("section.places").append(articleHTML)
                });
            },
            dataType: "json"
        });
    })
  });
  