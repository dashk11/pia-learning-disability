$(document).ready(function () {

  // $('#rulerAssist').change(function() {
  //   if (this.checked) {

  //     console.log("showing ruler")
  //     $('#ruler').css('display', 'block');
  //   } else {
  //     console.log("hiding ruler")
  //     $('#ruler').css('display', 'none');
  //   }
  // });

  $('#rulerAssistCheckbox').change(function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "toggleRuler"}, function(response) {
      console.log(response.status); // You can handle the response if needed
    });
  });
  });




  chrome.storage.sync.get(null, (items) => {
    var keys = Object.keys(items);
    if (keys.length != 4) {
      // Not setup
      $("input").each(function () {
        var field = $(this).attr("id");
        items[field] = true;
      });
    }
    for (item in items) {
      $(`input#${item}`).prop("checked", items[item]);
    }
  });
});

$("input").on("click", function () {
  var field = $(this).attr("id");
  var checked = $(this).prop("checked");

  chrome.storage.sync.set({ [field]: checked });
});
