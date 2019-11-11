"use strict";

/* eslint-disable no-undef */
// Global variables here
var categories = [];
var orderItems = [];
var bags = [];
var bagsInCart = [];
var additional = [];
var visibleItems = [];
var cart = [];
var categorySelected = 'All';
var screenWidth = window.screen.availWidth;
var currentRemoveItemID = ''; // Shamelessly taken from https://stackoverflow.com/questions/8101201/change-css-based-on-mobile-orientation

window.addEventListener("orientationchange", function () {
  // orientation
  screenWidth = window.screen.availWidth;

  if (screenWidth >= 601) {
    $("#cssElement").attr('href', 'css/large-screen.css');
  } else {
    $("#cssElement").attr('href', 'css/small-screen.css');
  }
}); // Template item for each order item
// const orderItemMobileTemplate = `
//     <div id="item1" class="order-item">
//       <div>
//           <img src="{{imageUrl}}" class="product-icon" />
//       </div>
//       <div style="text-align: left;">
//         <span class="h3">{{productName}}</span><br />
//         <span class="h4">Price: &#36;{{price}}</span><br />
//         <span class="h5">Item: {{itemNumber}}</span><br />
//         <span><small>{{categories}}</small></span>
//       </div>
//       <div class="order-item-add-to-cart">
//       <input id="item{{itemID}}" type="number" class="form-control input-number" value="0" onblur="checkInput('item{{itemID}}')" 
//       min="1" max="999" style="text-align: center; width: 55px;">
//         <div>
//           <button type="button" class="btn btn-success" onClick="addToCart({{itemID}})">Add to cart</button>
//         </div>
//       </div>
//     </div>
// `;

var orderItemMobileTemplate = "\n  <div class=\"order-item-new\">\n    <div class=\"row\" style=\"padding-bottom: 5px;\">\n      <img src=\"{{imageUrl}}\" />\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-12\" style=\"text-align: left; padding-bottom: 5px;\">\n        <span class=\"h3\">{{productName}}</span>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-xs-6\" style=\"text-align: left;\">\n        <span class=\"h4\">Price: &#36;{{price}}</span><br />\n        <span class=\"h5\">Item: {{itemNumber}}</span><br />\n        <span><small>{{categories}}</small></span>\n      </div>\n      <div class=\"col-xs-6\">\n        <div class=\"order-item-add-to-cart\">\n          <div class=\"input-group\">\n            <span class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-default btn-number\" onclick=\"subQuantity('item{{itemID}}')\">\n                <span class=\"glyphicon glyphicon-minus\"></span>\n              </button>\n            </span>\n            <input id=\"item{{itemID}}\" type=\"number\" class=\"form-control input-number\" value=\"0\" min=\"1\" max=\"999\" onblur=\"checkInput('item{{itemID}}')\"\n              style=\"text-align: center;\">\n            <span class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-default btn-number\" onclick=\"addQuantity('item{{itemID}}')\">\n                <span class=\"glyphicon glyphicon-plus\"></span>\n              </button>\n            </span>\n          </div>\n          <div style=\"padding-bottom: 5px;\">\n            <br />\n            <button type=\"button\" class=\"btn btn-success\" onClick=\"addToCart('{{itemID}}')\">Add to cart</button>\n          </div>\n        </div>\n      </div>\n\n    </div>\n  </div>\n";
var orderItemTable = "\n  <table id=\"itemTable\" class=\"table\">\n    <thead>\n      <th></th>\n      <th>Product Name</th>\n      <th>Item #</th>\n      <th>Price</th>\n      <th>Quantity</th>\n      <th></th>\n    </thead>\n    <tbody>\n      \n    </tbody>\n  </table>\n";
var orderItemDesktopTemplate = "\n  <tr>\n    <td style=\"text-align: left;\"><img src=\"{{imageUrl}}\" /></td>\n    <td style=\"text-align: left;\">\n      <span class=\"h2\">{{productName}}</span><br />\n      {{categories}}\n    </td>\n    <td style=\"text-align: left;\">{{itemNumber}}</td>\n    <td style=\"text-align: left;\">&#36;{{price}}</td>\n    <td><input id=\"item{{itemID}}\" type=\"number\" class=\"form-control input-number\" value=\"0\" onblur=\"checkInput('item{{itemID}}')\" \n      min=\"1\" max=\"999\" style=\"text-align: center; width: 55px;\"></td>\n    <td><button type=\"button\" class=\"btn btn-success\" onclick=\"addToCart('{{itemID}}')\">Add to cart</button></td>\n  </tr>\n";
var cartTableTemplate = "\n  <table id=\"cartTable\" class=\"table\">\n    <thead>\n      <th>Item Info</th>\n      <th>Quantity</th>\n      <th></th>\n    </thead>\n    <tbody>\n    </tbody>\n  </table>\n";
var cartItemTemplate = "\n  <tr>\n    <td>\n      <span class=\"h3\">{{productName}}</span><br />\n      <span class=\"h4\">Price: &#36;{{price}}</span><br />\n      <span class=\"h5\">Item: {{itemNumber}}</span><br />\n    </td>\n    <td>\n      <input id=\"cartItem{{itemID}}\" type=\"number\" class=\"form-control input-number\" value=\"{{quantity}}\"\n        onblur=\"checkInput('cartItem{{itemID}}')\" min=\"1\" max=\"999\" style=\"text-align: center; width: 50px;\">\n    </td>\n    <td style=\"text-align: center;\">\n      <button type=\"button\" class=\"btn btn-primary\" onClick=\"updateItemInCart('{{itemID}}')\">\n        <span class=\"glyphicon glyphicon-refresh\"></span>\n      </button>\n      <button type=\"button\" class=\"btn btn-danger\" data-toggle=\"modal\" data-target=\"#confirmRemove\" onclick=\"setCurrentRemoveItemID('{{itemID}}')\">\n        <span class=\"glyphicon glyphicon-trash\"></span>\n      </button>\n    </td>\n  </tr>\n";
$(function () {
  // Initially set css
  screenWidth = window.screen.availWidth;

  if (screenWidth >= 601) {
    $("#cssElement").attr('href', 'css/large-screen.css');
  } else {
    $("#cssElement").attr('href', 'css/small-screen.css');
  }

  function getReorders() {
    // Get the current URL search string
    var customerInfo = window.location.search; // Parse the query string to get the customer ID and Token
    // CODE HERE //

    $.ajax({
      // The URL for the request
      // url: "https://penguinpatch.com/sponsor/api/reorder/",
      url: "https://demo1573184.mockable.io/reorder",
      // The data to send (will be converted to a query string)
      data: {
        token: "xla0sIskoalSqQwpk0230la",
        customerNumber: "20140621"
      },
      // Whether this is a POST or GET request
      type: "POST",
      // The type of data we expect back
      dataType: "json"
    }).done(function (data) {
      // Set the global variables
      categories = data.categories.sort();
      categories.unshift('All');
      orderItems = data.items;
      visibleItems = orderItems;
      updateCart();
      bags = data.bags;
      additional = data.additional; // Format the categories

      formatCategories(); // Add the Order item cards

      if (screenWidth >= 601) {
        addOrderItemsForDesktop();
      } else {
        addOrderItemsForMobile();
      }
    }).fail(function (xhr, status, errorThrown) {
      console.log(errorThrown);
    });
  }

  getReorders();
}); // GLOBAL FUNCTIONS //

function selectCategory(catSelected) {
  categorySelected = catSelected;
  searchForText();
}

function searchForText() {
  var searchText = $("#itemSearch").val().toUpperCase(); // Update the Category button to say Category: <name>

  if (screenWidth >= 601) {
    var ddlCategories = $("#ddlDesktop");
    ddlCategories.text("Category: ".concat(categorySelected, " "));
  }

  if (categorySelected === 'All') {
    visibleItems = orderItems.filter(function (item) {
      return item.productName.toUpperCase().includes(searchText);
    });
  } else {
    visibleItems = orderItems.filter(function (item) {
      return item.productName.toUpperCase().includes(searchText) && item.categories.includes(categorySelected);
    });
  }

  refreshVisibleOrderItems();
}

function addToCart(itemID) {
  // find the input for quantity
  var quantityInput = $("#item".concat(itemID));
  var currentValue = parseInt(quantityInput.val());

  if (!currentValue || currentValue < 1) {
    alert('Invalid quantity for item.');
    return;
  } // Now see if this item is already in the cart


  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = orderItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (!(item.itemID === itemID)) {
        continue;
      }

      item.quantity = (parseInt(item.quantity) + currentValue).toString(); // TODO: Uncomment when api is working
      // postUpdateQuantity(item);
    } // Set the input to 0

  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  quantityInput.val("0");
  showSnackbar('Item added to cart');
  updateCart();
}

function updateCart() {
  cart = orderItems.filter(function (item) {
    return parseInt(item.quantity) > 0;
  });
  bagsInCart = bags.filter(function (item) {
    return parseInt(item.quantity) > 0;
  });
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = bagsInCart[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var bag = _step2.value;
      cart.push(bag);
    } // Clear the body

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  $(".cd-panel__content").empty();

  if (cart.length === 0) {
    $(".cd-panel__content").prepend("<p>Your cart is empty.</p>");
    return;
  } // Now add the items to the cart display table
  // First add the table object


  var cartDisplay = $(".cd-panel__content");
  var cartTable = $(cartTableTemplate);
  cartDisplay.prepend(cartTable); // Now go through the cart items and add them to the cart table

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = cart[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var item = _step3.value;
      var newItem = cartItemTemplate;
      newItem = newItem.replace(/{{productName}}/g, item.productName);
      newItem = newItem.replace(/{{itemNumber}}/g, item.itemNumber);
      newItem = newItem.replace(/{{price}}/g, item.price);
      newItem = newItem.replace(/{{quantity}}/g, item.quantity);
      newItem = newItem.replace(/{{itemID}}/g, item.itemID);
      $("#cartTable > tbody:last-child").append(newItem);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }
}

function updateItemInCart(itemID) {
  // Basically just update the Order items and then push update to server
  // Validate first
  var cartItemInput = $("#cartItem".concat(itemID));
  var currentValue = parseInt(cartItemInput.val());

  if (!currentValue || currentValue < 0) {
    alert('Invalid quantity. Please check and resubmit.');
    return;
  } // Update the order items array, then update the cart item


  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = orderItems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var item = _step4.value;

      if (item.itemID !== itemID) {
        continue;
      }

      item.quantity = currentValue.toString();
    } // Get the actual item from the cart and update quantity

  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var cartItem;
  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = cart[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var _item = _step5.value;

      if (_item.itemID !== itemID) {
        continue;
      }

      _item.quantity = currentValue.toString();
      cartItem = _item;
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  if (!cartItem) {
    alert('There was an error, please contact your administrator.');
    return;
  }

  showSnackbar('Item updated'); // TODO: Uncomment to allow actual POST
  // postUpdateQuantity(cartItem);
}

function postUpdateQuantity(item) {
  $.ajax({
    // The URL for the request
    // url: "https://penguinpatch.com/sponsor/api/reorder/",
    url: 'https://penguinpatch.com/sponsor/api/quantity/',
    // The data to send (will be converted to a query string)
    data: {
      token: 'xla0sIskoalSqQwpk0230la',
      customerNumber: '20140621',
      itemID: item.itemID,
      kitID: item.kitID,
      quantity: item.quantity
    },
    // Whether this is a POST or GET request
    type: "POST",
    // The type of data we expect back
    dataType: "json"
  }).done(function (data) {
    if (data.status !== 'OK') {
      alert('There was an error trying to update the quantity.');
    }
  }).fail(function (xhr, status, errorThrown) {
    console.log(errorThrown);
  });
}

function setCurrentRemoveItemID(itemID) {
  currentRemoveItemID = itemID;
}

function removeItemFromCart() {
  var itemID = currentRemoveItemID; // Find the item in the orderItems and set quantity to 0

  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = orderItems[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var item = _step6.value;

      if (item.itemID !== itemID) {
        continue;
      }

      item.quantity = "0";
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  showSnackbar('Item removed from cart');
  updateCart();
}

function formatBags() {}

function formatCategories() {
  if (screenWidth >= 601) {
    // This is desktop
    // First create the drop button
    var catMenu = $("#catMenuDesktop");
    var catButton = $("<button></button>").addClass("btn").addClass("btn-default").addClass("btn-lg").addClass("dropdown-toggle").attr("style", "width: 100%;").attr("type", "button").attr("id", "ddlDesktop").attr("data-toggle", "dropdown").attr("aria-haspopup", "true").text("Category: All ");
    var caret = $("<span></span>").addClass("caret");
    catButton.append(caret);
    catMenu.append(catButton); // Now create the menu

    var ddMenu = $("<ul></ul>").addClass("dropdown-menu").attr("aria-labelledby", "ddlDesktop");
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      for (var _iterator7 = categories[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        var category = _step7.value;
        var newItem = $("<li></li>");
        var newLink = $("<a href='#' onClick=\"selectCategory('".concat(category, "')\">").concat(category, "</a>"));
        newItem.append(newLink);
        ddMenu.append(newItem);
      }
    } catch (err) {
      _didIteratorError7 = true;
      _iteratorError7 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
          _iterator7.return();
        }
      } finally {
        if (_didIteratorError7) {
          throw _iteratorError7;
        }
      }
    }

    catMenu.append(ddMenu);
  } else {
    // This is mobile
    // Get the category menu div
    var _catMenu = $("#catMenuMobile"); // Add the categories to the header menu


    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
      for (var _iterator8 = categories[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
        var _category = _step8.value;
        var tempElement = $("<a href='#' onClick=\"selectCategory('".concat(_category, "')\">").concat(_category, "</a>"));

        _catMenu.append(tempElement);
      }
    } catch (err) {
      _didIteratorError8 = true;
      _iteratorError8 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
          _iterator8.return();
        }
      } finally {
        if (_didIteratorError8) {
          throw _iteratorError8;
        }
      }
    }
  }
}

function addOrderItemsForMobile() {
  // Go through the visible items and add them
  var itemList = $("#itemList").empty();
  var _iteratorNormalCompletion9 = true;
  var _didIteratorError9 = false;
  var _iteratorError9 = undefined;

  try {
    for (var _iterator9 = visibleItems[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
      var item = _step9.value;
      var newItemTemplate = orderItemMobileTemplate;
      newItemTemplate = newItemTemplate.replace("{{imageUrl}}", item.imageUrl);
      newItemTemplate = newItemTemplate.replace("{{itemNumber}}", item.itemNumber);
      newItemTemplate = newItemTemplate.replace("{{productName}}", item.productName);
      newItemTemplate = newItemTemplate.replace("{{price}}", item.price);
      newItemTemplate = newItemTemplate.replace("{{quantity}}", item.quantity);
      newItemTemplate = newItemTemplate.replace(/{{itemID}}/g, item.itemID);
      var categoryElementString = ''; // Now the categories

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = item.categories[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var category = _step10.value;
          categoryElementString += "<span class=\"label label-primary\">".concat(category, "</span> ");
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      newItemTemplate = newItemTemplate.replace("{{categories}}", categoryElementString);
      itemList.append(newItemTemplate);
    }
  } catch (err) {
    _didIteratorError9 = true;
    _iteratorError9 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
        _iterator9.return();
      }
    } finally {
      if (_didIteratorError9) {
        throw _iteratorError9;
      }
    }
  }
}

function addOrderItemsForDesktop() {
  var itemList = $("#itemList").empty();
  var itemTable = $(orderItemTable);
  itemList.prepend(itemTable);
  var _iteratorNormalCompletion11 = true;
  var _didIteratorError11 = false;
  var _iteratorError11 = undefined;

  try {
    for (var _iterator11 = visibleItems[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
      var item = _step11.value;
      var newItemTemplate = orderItemDesktopTemplate;
      newItemTemplate = newItemTemplate.replace("{{imageUrl}}", item.imageUrl);
      newItemTemplate = newItemTemplate.replace("{{itemNumber}}", item.itemNumber);
      newItemTemplate = newItemTemplate.replace("{{productName}}", item.productName);
      newItemTemplate = newItemTemplate.replace("{{price}}", item.price);
      newItemTemplate = newItemTemplate.replace("{{quantity}}", item.quantity);
      newItemTemplate = newItemTemplate.replace(/{{itemID}}/g, item.itemID);
      var categoryElementString = ''; // Now the categories

      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = item.categories[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var category = _step12.value;
          categoryElementString += "<span class=\"label label-primary\">".concat(category, "</span> ");
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      newItemTemplate = newItemTemplate.replace("{{categories}}", categoryElementString);
      $("#itemTable > tbody:last-child").append(newItemTemplate);
    }
  } catch (err) {
    _didIteratorError11 = true;
    _iteratorError11 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
        _iterator11.return();
      }
    } finally {
      if (_didIteratorError11) {
        throw _iteratorError11;
      }
    }
  }
}

function refreshVisibleOrderItems() {
  if (screenWidth >= 601) {
    addOrderItemsForDesktop();
  } else {
    addOrderItemsForMobile();
  }
}

function addQuantity(itemID) {
  // Find the element
  var quantityInput = $("#".concat(itemID));
  var currentValue = parseInt(quantityInput.val());
  quantityInput.val(currentValue + 1);
}

function subQuantity(itemID) {
  // Find the element
  var quantityInput = $("#".concat(itemID));
  var currentValue = parseInt(quantityInput.val());

  if (currentValue > 0) {
    quantityInput.val(currentValue - 1);
  }
} // Checks whether this is a number or empty


function checkInput(itemID) {
  var quantityInput = $("#".concat(itemID));
  var currentValue = quantityInput.val();

  if (!currentValue || currentValue < 0) {
    quantityInput.val("0");
  }
}

function showSnackbar(snackbarText) {
  // Get the snackbar DIV
  var snackbar = $("#snackbar"); // Add the "show" class to DIV

  snackbar.addClass('show');
  snackbar.text(snackbarText); // After 3 seconds, remove the show class from DIV

  setTimeout(function () {
    snackbar.removeClass('show');
  }, 3000);
} //////// PANEL ////////


(function () {
  // Slide In Panel - by CodyHouse.co
  var panelTriggers = document.getElementsByClassName('js-cd-panel-trigger');

  if (panelTriggers.length > 0) {
    for (var i = 0; i < panelTriggers.length; i++) {
      (function (i) {
        var panelClass = 'js-cd-panel-' + panelTriggers[i].getAttribute('data-panel'),
            panel = document.getElementsByClassName(panelClass)[0]; // open panel when clicking on trigger btn

        panelTriggers[i].addEventListener('click', function (event) {
          event.preventDefault();
          addClass(panel, 'cd-panel--is-visible');
        }); //close panel when clicking on 'x' or outside the panel

        panel.addEventListener('click', function (event) {
          if (hasClass(event.target, 'js-cd-close') || hasClass(event.target, panelClass)) {
            event.preventDefault();
            removeClass(panel, 'cd-panel--is-visible');
          }
        });
      })(i);
    }
  } //class manipulations - needed if classList is not supported
  //https://jaketrent.com/post/addremove-classes-raw-javascript/


  function hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }

  function addClass(el, className) {
    if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
  }

  function removeClass(el, className) {
    if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  }
})();