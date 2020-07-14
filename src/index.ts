import "../styles/style.scss";
import paper from "paper";
import Network from "./model/network/Network";
import NetworkPanel from "./nodes/network/NetworkPanel";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  paper.setup(canvas);
  document.body.appendChild(canvas);

  paper.tool = new paper.Tool();

  const networkPanel = new NetworkPanel(new Network());

});
