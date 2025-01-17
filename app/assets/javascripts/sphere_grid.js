ATTRIBUTE_ABBREVIATIONS = {
  HP: "HP",
  MP: "MP",
  Strength: "STR",
  Defense: "DEF",
  Magic: "MAG",
  "Magic Defense": "MDef",
  Agility: "AGL",
  Luck: "Luck",
  Evasion: "EVA",
  Accuracy: "ACC",
};

ATTRIBUTE_COLORS = {
  HP: "#ade6b0",
  MP: "#ade6cc",
  Strength: "#e6adad",
  Defense: "#adcbe6",
  Magic: "#e1ade6",
  "Magic Defense": "#b9ade6",
  Agility: "#e6c9ad",
  Luck: "#e6daad",
  Evasion: "#b2e6ad",
  Accuracy: "#e6adc7",
};

$(document).ready(function () {
  CANVAS = Raphael("sphere-grid", "100%", "100%");

  var activations = [];
  var allCharacters = [];
  var characterName = "Tidus";
  var characterColor = "blue";

  $("#character-tabs").tabs({ heightStyle: "fill" });
  initializeSphereGrid();
  recordCharacters();
  applyCharacterBadgeColors();

  $("#info-panel").on("click", ".character-name", initializeSphereGrid);

  function applyCharacterBadgeColors() {
    $(".char-badges li")
      .hide()
      .each(function () {
        $(this).css("background-color", $(this).data("color"));
      });
  }

  function initializeSphereGrid() {
    characterName = $("li.character-name.ui-state-active:eq(0)").data("name");
    characterColor = $("li.character-name.ui-state-active:eq(0)").data("color");
    _.each(activations, function (circle) {
      circle.remove();
    });
    activations = [];
    $.get("/node_data", function (nodes) {
      CANVAS.clear();
      _.each(nodes, drawNode);
    });
  }

  function drawNode(node) {
    const diameter = 13;
    _.each(node.connections, function (connection) {
      drawConnection(node.x, node.y, connection[0], connection[1]);
    });
    if (node.attribute_name) {
      drawStatNode(CANVAS.circle(node.x, node.y, diameter), node);
    } else if (node.ability) {
      drawAbilityNode(CANVAS.circle(node.x, node.y, diameter), node);
    } else if (node.lock_level) {
      drawLockNode(CANVAS.circle(node.x, node.y, diameter), node);
    } else {
      drawEmptyNode(CANVAS.circle(node.x, node.y, 5), node);
    }
  }

  function recordCharacters() {
    allCharacters = $(".char-badges li")
      .map(function () {
        return $(this).data();
      })
      .toArray();
  }

  function drawConnection(start_x, start_y, end_x, end_y) {
    var pathString = ["M", start_x, start_y, "L", end_x, end_y].join(" ");
    CANVAS.path(pathString).attr("stroke-width", 2).toBack();
  }

  function drawEmptyNode(circle, node) {
    circle.attr({ fill: "white" }).mouseover(function () {
      showNodePanel(node);
    });
  }

  function drawStatNode(circle, node) {
    circle
      .attr({ fill: ATTRIBUTE_COLORS[node.attribute_name] })
      .data(node)
      .click(function () {
        toggleCharacterActivation(node);
      })
      .mouseover(function () {
        showNodePanel(node);
      });
    CANVAS.text(
      node.x,
      node.y - 4,
      ATTRIBUTE_ABBREVIATIONS[node.attribute_name]
    )
      .attr("font-size", 8)
      .click(function () {
        toggleCharacterActivation(node);
      });
    var valueFontSize = node.attribute_name == "HP" ? 10 : 12;
    CANVAS.text(node.x, node.y + 5, node.value)
      .attr("font-size", valueFontSize)
      .click(function () {
        toggleCharacterActivation(node);
      });
    if (characterHasActivated(node)) {
      addCharacterActivation(node);
    }
  }

  function drawAbilityNode(circle, node) {
    circle
      .attr({ fill: "palevioletred", title: node.ability.name })
      .data(node)
      .click(function () {
        toggleCharacterActivation(node);
      })
      .mouseover(function () {
        showNodePanel(node);
      });
    if (_.contains(node.ability.name, " ")) {
      var abilityWords = node.ability.name.split(" ");
      CANVAS.text(node.x, node.y - 4, abilityWords[0])
        .attr("font-size", 6)
        .click(function () {
          toggleCharacterActivation(node);
        });
      CANVAS.text(node.x, node.y + 4, abilityWords[1])
        .attr("font-size", 6)
        .click(function () {
          toggleCharacterActivation(node);
        });
    } else {
      CANVAS.text(node.x, node.y, node.ability.name)
        .attr("font-size", 6)
        .click(function () {
          toggleCharacterActivation(node);
        });
    }
    if (characterHasActivated(node)) {
      addCharacterActivation(node);
    }
  }

  function drawLockNode(circle, node) {
    circle.attr({ fill: "#2d3436" }).mouseover(function () {
      showNodePanel(node);
    });
    CANVAS.text(node.x, node.y - 5, "LV.").attr({
      fill: "white",
      "font-size": 8,
    });
    CANVAS.text(node.x, node.y + 5, node.lock_level).attr({
      fill: "white",
      "font-size": 12,
    });
  }

  function characterHasActivated(node) {
    var charNames = _.map(node.characters, "name");
    return _.contains(charNames, characterName);
  }

  function addCharacterActivation(node) {
    var activation = CANVAS.circle(node.x, node.y, 15)
      .attr({ stroke: characterColor, "stroke-width": 5 })
      .toBack();
    activations.push(activation);
    var newCharacter = _.find(allCharacters, function (character) {
      return character.name == characterName;
    });
    node.characters = _.uniq(node.characters.concat(newCharacter));
  }

  function removeCharacterActivation(node) {
    var matchingElements = CANVAS.getElementsByPoint(node.x, node.y + 14);
    var activationCircle = _.find(matchingElements, function (element) {
      return element.type == "circle";
    });
    if (activationCircle !== undefined) activationCircle.remove();
    var character = _.find(node.characters, function (character) {
      return character.name == characterName;
    });
    node.characters = _.without(node.characters, character);
  }

  function toggleCharacterActivation(node) {
    $.post(
      "/toggle_node",
      { character: characterName, id: node.id },
      function (response) {
        reloadCharacterInfo();
        if (response.activated) addCharacterActivation(node);
        else removeCharacterActivation(node);
        showNodePanel(node);
      }
    );
  }

  function reloadCharacterInfo() {
    $.get("/character_info?character=" + characterName, function (resultHtml) {
      $(".character-info:visible").html(resultHtml);
    });
  }

  function showNodePanel(node) {
    var panel = $("#node-panel");
    panel.find(".node-attrs#id").text(node.id);
    panel.find(".node-attrs#x").text(node.x);
    panel.find(".node-attrs#y").text(node.y);
    panel.find(".node-attrs#attribute").text(node.attribute_name || "");
    panel.find(".node-attrs#value").text(node.value || "");
    var abilityName;
    if (node.ability) abilityName = node.ability.name;
    panel.find(".node-attrs#ability").text(abilityName || "");
    panel.find(".node-attrs#lock_level").text(node.lock_level || "");
    $(".char-badges li")
      .hide()
      .filter(function () {
        var charNames = _.map(node.characters, "name");
        return _.contains(charNames, $(this).data("name"));
      })
      .show();
  }
});
