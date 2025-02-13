import "../styles/style.scss";
import paper from "paper";
import Network from "./model/network/Network";
import NetworkPanel from "./gui/network/NetworkPanel";
import { setInterval } from "timers";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 300;
  paper.setup(canvas);

  const appDiv = document.getElementById("simbrain_web") as HTMLDivElement;

  appDiv.appendChild(canvas);

  paper.tool = new paper.Tool();

  const demoNetwork = new Network();

  const neuronsCoordinates = (window as any).neuronCoordinates as [number, number][];

  const neurons = neuronsCoordinates.map(([x, y]) => demoNetwork.createNeuron({
    coordinate: {x, y}
  }));

  (window as any).neurons = neurons;

  const synapseIndices = (window as any).synapseIndices as [number, number][];
  
  const synapses = synapseIndices.map(([sourceIndex, targetIndex]) => (
    demoNetwork.createSynapse({
      source: neurons[sourceIndex],
      target: neurons[targetIndex],
      weight: (Math.random() - 0.5) * 2.0
    })
  ));

  (window as any).synapses = synapses;

  const networkPanel = new NetworkPanel(demoNetwork);

  (window as any).networkPanel = networkPanel;

  networkPanel.clearSelection();

});
