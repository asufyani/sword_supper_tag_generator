// ==UserScript==
// @name         Supper Autotag
// @version      2025-08-06
// @description  try to take over the world!
// @author       You
// @match        https://*.devvit.net/index.html*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @updateURL    https://github.com/asufyani/sword_supper_tag_generator/raw/refs/heads/main/autotag.js
// ==/UserScript==

(function () {
  "use strict";
  let divAdded = false;
  window.addEventListener("message", function (data) {
    if (data.data.data.message.type == "initialData") {
      const missionData = data.data.data.message.data.missionMetadata.mission;
      const encounters = missionData.encounters;
      debugger;
      const outputData = {
        enemyTypes: {},
        tags: [],
        rewards: [],
      };
      outputData.tags.push(`${missionData.difficulty}*`);
      encounters.forEach((encounter) => {
        if (encounter.type == "enemy") {
          encounter.enemies.forEach((enemy) => {
            outputData.enemyTypes[enemy.type] = 1;
          });
        } else if (encounter.type == "treasure") {
          encounter.reward.essences.forEach((essence) => {
            outputData.rewards.push(`${essence.quantity} ${essence.id}`);
          });
        } else if (encounter.type == "crossroadsFight") {
          outputData.tags.push(`${encounter.enemies[0].type} miniboss`);
        } else if (encounter.type == "boss") {
          outputData.tags.push(`${encounter.enemies[0].type} boss`);
        } else if (encounter.type == "investigate") {
          outputData.tags.push("hut");
        }
      });

      const floatingDiv = document.createElement("div");
      floatingDiv.id = "myFloatingDiv";
      floatingDiv.innerHTML = `enemies: ${Object.keys(outputData.enemyTypes).join(", ")} <br/> tags: ${outputData.tags.join(" + ")} <br/> rewards: ${outputData.rewards}`;
      let closeButton = document.createElement("button");
      closeButton.id = "closeFloatingDiv";
      closeButton.textContent = "X";

      // Append close button to the floating div
      floatingDiv.appendChild(closeButton);

      // Add CSS styles for positioning and appearance
      GM_addStyle(`
        #myFloatingDiv {
            position: fixed; /* Makes the div float relative to the viewport */
            bottom: 20px;    /* Adjust as needed for vertical position */
            right: 20px;     /* Adjust as needed for horizontal position */
            background-color: #000;
            border: 1px solid #ccc;
            padding: 15px;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 9999;   /* Ensures the div appears on top of other elements */
            border-radius: 5px;
            font-family: sans-serif;
            color: #fff;
        }
        #closeFloatingDiv {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
            padding: 5px 8px;
        }
    `);
      closeButton.addEventListener("click", () => {
        floatingDiv.remove();
      });
      if (!divAdded) {
        divAdded = true;
        $("body").append(floatingDiv);
      }
    }
  });
  // Your code here...
})();
