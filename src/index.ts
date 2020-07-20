import "../styles/style.scss";
import paper from "paper";
import Network from "./model/network/Network";
import NetworkPanel from "./nodes/network/NetworkPanel";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  paper.setup(canvas);

  const appDiv = document.getElementById("app") as HTMLDivElement;

  appDiv.appendChild(canvas);

  paper.tool = new paper.Tool();

  const demoNetwork = new Network();
  const neuron1 = demoNetwork.createNeuron({
    coordinate: { x: 0, y: 100 },
    value: 0.7
  });
  const neuron2 = demoNetwork.createNeuron({
    coordinate: { x: 0, y: 0 },
    value: -0.2
  });
  const neuron3 = demoNetwork.createNeuron({
    coordinate: { x: 0, y: -100 },
    value: 0.3
  });
  const neuron4 = demoNetwork.createNeuron({
    coordinate: { x: 141, y: 0 }
  });
  const neuron5 = demoNetwork.createNeuron({
    coordinate: { x: 282, y: 0 }
  });
  demoNetwork.createSynapse({
    source: neuron1,
    target: neuron4
  });
  demoNetwork.createSynapse({
    source: neuron2,
    target: neuron4,
    weight: 3
  });
  demoNetwork.createSynapse({
    source: neuron3,
    target: neuron4,
    weight: -1
  });
  demoNetwork.createSynapse({
    source: neuron4,
    target: neuron5,
    weight: -1
  });

  const networkPanel = new NetworkPanel(demoNetwork);

});
