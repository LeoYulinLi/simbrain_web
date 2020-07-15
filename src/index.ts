import "../styles/style.scss";
import paper from "paper";
import Network from "./model/network/Network";
import NetworkPanel from "./nodes/network/NetworkPanel";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  paper.setup(canvas);

  const mainDiv = document.createElement("div");
  mainDiv.className = "main";

  mainDiv.appendChild(canvas);

  document.body.appendChild(mainDiv);

  paper.tool = new paper.Tool();

  const networkPanel = new NetworkPanel(new Network());

});
