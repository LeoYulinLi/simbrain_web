import { Neuron } from "../../model/network/Neuron";
import paper from "paper";

export class NeuronNode {

  private number = new paper.PointText(new paper.Point(0, 0));

  private circle = new paper.Shape.Circle(new paper.Point(0, 0), 20);

  private _node = new paper.Group([this.circle, this.number]);

  constructor(private neuron: Neuron) {
    this.circle.strokeWidth = 2;
    this.circle.strokeColor = new paper.Color("black");
    this.circle.fillColor = new paper.Color("white");
    this.number.content = this.neuron.value.toFixed(1);
    this.number.justification = "center";
    this.number.fontSize = 16;
    this.number.translate(new paper.Point(0, - this.number.position.y));
    neuron.events.on("value", value => {
      console.log("value");
      this.number.content = value.toFixed(1);
    });
    this._node.onMouseDrag = (event: paper.MouseEvent) => {
      console.log("here");
      this._node.position = this._node.position.add(event.delta);
    };
  }

  get node(): paper.Group {
    return this._node;
  }
}
