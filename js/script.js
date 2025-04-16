var address = 'https://raw.githubusercontent.com/Secuter/SecuterYGOCustomCards-pics/main/';
var sets = [];
var latest_count = 5;

// Sort archetypes by name
var sortedCards = Object.entries(cards);
sortedCards.sort(function (a, b) {
  return a[0].localeCompare(b[0]);
});
cards = {};
for (var i = 0; i < sortedCards.length; i++) {
  cards[sortedCards[i][0]] = sortedCards[i][1];
  sets.push(sortedCards[i][0]);
}

// Get most recent archetypes
sortedCards = sortedCards.map(([name, data]) => {
  const dateStr = data.last_update || data.release_date;
  return {
    name,
    data,
    sortDate: new Date(dateStr)
  };
}).sort((a, b) => b.sortDate - a.sortDate).slice(0, latest_count);
var latest_archetypes = [];
for (var i = 0; i < sortedCards.length; i++) {
  latest_archetypes.push(sortedCards[i].name);
}
delete sortedCards;

function splitByFirstDash(input) {
  const index = input.indexOf("-");
  if (index === -1) {
    return { main: input };
  }
  return { main: input.substring(0, index), sub: input };
}

function showCards(setid) {
  if ($("#setname").html() == setid) {
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  }
  else {
    $("#setname").html(setid);
    $("#search").val(setid);
    var result = "";
    $.each(cards[setid]['cards'], function (_, card) {
      result = result.concat("<img src='", address, card, ".png?raw=true' />");
    });
    $("#cards").html(result);
    $("#archetypes").hide();
    $("#back").show();
  }
}

function drawArchetypeButton(archetype) {
  var info = cards[archetype];
  return "<button class='ui-button ui-widget ui-corner-all archetype' id='".concat(archetype, "' style='background-image: url(\"", address, info.thumbnail, ".png?raw=true\");'><span>", archetype, "</span><span>Release: ", info.release_date,
    (info.last_update !== undefined && info.last_update !== null) ? "<br>Last update: ".concat(info.last_update) : "",
    "</span></button>");
}

function showLastArchetypes() {
  var buttons = "";

  latest_archetypes.forEach((archetype) => {
    buttons = buttons.concat(drawArchetypeButton(archetype));
  });
  buttons = buttons.concat("<hr>");
  $("#archetypes").html(buttons);
  $("#archetypes").show();

  $("button.archetype").click(function () {
    showCards($(this).attr("id"));
  });
}

function showArchetypes(id) {
  var buttons = "";

  if (id === undefined) {
    // Show all
    Object.values(archetypes).forEach(main => {
      Object.values(main).forEach(sub => {
        Object.values(sub).forEach(archetype => {
          buttons = buttons.concat(drawArchetypeButton(archetype));
        });
      });
    });
  }
  else {
    var arch = splitByFirstDash(id);

    if ('sub' in arch) {
      // Show only a sub-group
      if (arch.main in archetypes && arch.sub in archetypes[arch.main]) {
        Object.values(archetypes[arch.main][arch.sub]).forEach(archetype => {
          buttons = buttons.concat(drawArchetypeButton(archetype));
        });
      }
    } else {
      // Show all sub-groups of the era
      if (arch.main in archetypes) {
        Object.values(archetypes[arch.main]).forEach(sub => {
          Object.values(sub).forEach(archetype => {
            buttons = buttons.concat(drawArchetypeButton(archetype));
          });
        });
      }
    }
  }
  buttons = buttons.concat("<hr>");
  $("#archetypes").html(buttons);
  $("#archetypes").show();

  $("button.archetype").click(function () {
    showCards($(this).attr("id"));
  });
}

$(function () {
  $("button#latest").click(function () {
    $("#tab-era1").hide();
    $("#tab-era2").hide();
    $("#tab-era3").hide();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
    showLastArchetypes();
  });
  $("button#all").click(function () {
    $("#tab-era1").hide();
    $("#tab-era2").hide();
    $("#tab-era3").hide();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
    showArchetypes();
  });
  $("button#era1").click(function () {
    $("#tab-era1").show();
    $("#tab-era2").hide();
    $("#tab-era3").hide();
    $("#archetypes").empty();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  });
  $("button#era2").click(function () {
    $("#tab-era1").hide();
    $("#tab-era2").show();
    $("#tab-era3").hide();
    $("#archetypes").empty();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  });
  $("button#era3").click(function () {
    $("#tab-era1").hide();
    $("#tab-era2").hide();
    $("#tab-era3").show();
    $("#archetypes").empty();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  });
  $("button#back").click(function () {
    $("#archetypes").show();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  });

  $("button.era").click(function () {
    var setid = $(this).attr("id");
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
    showArchetypes(setid);
  });

  $(".autocomplete").autocomplete({
    source: sets,
    close: function () {
      var setid = $(this).val();
      if (sets.includes(setid)) {
        showCards(setid);
      }
    }
  });

  var isMobile = false;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    isMobile = true;
  }

  // Get local preference settings
  if (!localStorage.getItem("mode")) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      localStorage.setItem("mode", "dark-theme");
    } else {
      localStorage.setItem("mode", "light-theme");
    }
  }

  // Set interface to match local
  if (localStorage.getItem("mode") == "dark-theme") {
    $("body").addClass("dark-theme");
    $("body").removeClass("light-theme");
  } else {
    $("body").removeClass("dark-theme");
    $("body").addClass("light-theme");
  }

  // Switch dark mode button
  $("#dm-switch").click(function () {
    if ($("body").hasClass("dark-theme")) {
      $("body").removeClass("dark-theme");
      $("body").addClass("light-theme");
    }
    else {
      $("body").addClass("dark-theme");
      $("body").removeClass("light-theme");
    }
  });

  // Get archetype from URL
  var $_GET = new Array();
  var url = location.search.replace("?", "").split("&");
  for (var index = 0; index < url.length; index++) {
    var value = url[index].split("=");
    $_GET[value[0]] = value[1];
  }

  var setid = ($_GET["setId"]) ? $_GET["setId"].replace(/%20/g, " ").replace(/%27/g, "'") : "";
  if (sets.includes(setid)) {
    // Show archetype from URL
    showCards(setid);
    $("#search").val(setid);
  }
  else {
    // Show latest archetypes
    showLastArchetypes();
    $("#cards").empty();
    $("#setname").empty();
    $("#back").hide();
  }
});