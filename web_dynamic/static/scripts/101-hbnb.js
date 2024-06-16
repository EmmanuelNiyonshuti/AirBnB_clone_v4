/**
 * This script handles two main functionalities using jQuery:
 * 1. It listens for changes on checkboxes representing amenities and updates
 *    the displayed list of selected amenities in real-time.
 * 2. It makes AJAX requests to the backend API to check its status and to fetch
 *    a list of places, dynamically updating the webpage with the retrieved data.
 */
$(function () {
    const items = {
      states: {},
      cities: {},
      amenities: {}
    };
  
    $('input[type=checkbox]').on('change', function () {
      const name = $(this).data('name');
      const id = $(this).data('id');
      const type = $(this).data('type');
  
      if ($(this).is(':checked')) {
        if (type === 'states') {
          items.states[id] = name;
        } else if (type === 'cities') {
          items.cities[id] = name;
        } else if (type === 'amenities') {
          items.amenities[id] = name;
        }
      } else {
        if (type === 'states') {
          delete items.states[id];
        } else if (type === 'cities') {
          delete items.cities[id];
        } else if (type === 'amenities') {
          delete items.amenities[id];
        }
      }
      // const selectedItems = Object.values(items[type]).join(', ');
      // $(`.${type} h4`).text(selectedItems);
      if (type == 'amenities') {
        const SelectedAmenities = Object.values(items.amenities).join(', ');
        $(`.amenities h4`).text(SelectedAmenities);
      } else if (type == 'states') {
        const SelectedStates = Object.values(items.states).join(', ');
        $(`.locations h4`).text(SelectedStates);
      } else if (type == 'cities') {
        const SelectedCities = Object.values(items.cities).join(', ');
        $(`.locations h4`).text(SelectedCities);
      }
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
  
    $("button").on("click", function () {
      const postData = JSON.stringify({
        states: Object.values(items.states),
        cities: Object.values(items.cities),
        amenities: Object.values(items.amenities)
      });
  
      $.ajax({
        type: "POST",
        url: "http://localhost:5001/api/v1/places_search/",
        contentType: "application/json",
        data: postData,
        success: function (response) {
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
                <div class="amenities>
                    <h2>Amenities</h2>
                    <ul>
                        <li>${place.amenities}</li>
                    </ul>
                </div>
                <div class="reviews>
                    <h2>Reviews <span>show</span></h2>
                    <ul>
                    <li>${place.reviews}</li>
                    </ul>
                </div>
              </article>
            `;
            $("section.places").append(articleHTML);
          });
        },
        dataType: "json"
      });
      $('.reviews span').on('click', function() {
        $.ajax({
            type: "GET",
            url: `http://localhost:5001/api/v1/places/${place.id}/reviews`,
            success: function (response) {
                response.forEach(review => {
                    if (review.text == 'hide') {
                        $('.reviews').hide()
                    }
                })
            },
            dataType: "json"
        });
      })
    });
  });
  