import "../styles/style.scss";
import paper from "paper";
import Network from "./model/network/Network";

type ToolEvent = paper.ToolEvent;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  paper.setup(canvas);
  document.body.appendChild(canvas);
  const path = new paper.Path();
  path.strokeColor = new paper.Color("black");
  const start = new paper.Point(100, 100);
  path.moveTo(start);
  path.lineTo(start.add(new paper.Point(200, -50)));

  path.onFrame = function () {
    this.rotate(3);
  };

  const tool = new paper.Tool();

  const newPoint = new paper.Path.Rectangle(new paper.Point([5, 5]), new paper.Size([20, 20]));
  tool.onMouseDown = function (event: ToolEvent) {
    console.log("here");
    newPoint.strokeColor = new paper.Color("black");
    newPoint.strokeWidth = 3;
    newPoint.add(event.point);
  };

  newPoint.onFrame = function () {
    this.rotate(3);
  };

  const net = new Network();
  const source = net.createNeuron({ value: 1 });
  const target = net.createNeuron();
  net.createSynapse({ source, target, weight: 0.9 });
  net.createSynapse({ source: target, target: source });

  net.update(net => {
    console.log(JSON.stringify(Object.values(net.neurons).map(n => n.value)));
  });

  net.update(net => {
    console.log(JSON.stringify(Object.values(net.neurons).map(n => n.value)));
  });



});
