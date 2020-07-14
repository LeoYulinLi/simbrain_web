import { Neuron } from "../../model/network/Neuron";
import paper from "paper";
import eventEmitter from "../../events/emitter";

export class NeuronNode {

  private number = new paper.PointText(new paper.Point(0, 0));

  private circle = new paper.Shape.Circle(new paper.Point(0, 0), 12);

  private _node = new paper.Group([this.circle, this.number]);

  readonly events = eventEmitter<{
    click: NeuronNode
  }>()

  constructor(private neuron: Neuron) {
    this.circle.strokeColor = new paper.Color("black");
    this.circle.fillColor = new paper.Color("#ffffffaa");
    this.number.content = this.neuron.value.toPrecision(1);
    this.number.justification = "center";
    this.number.fontSize = 11;
    this.number.fontFamily = "Arial";
    this.number.translate(new paper.Point(0, - this.number.position.y));
    neuron.events.on("value", value => {
      this.number.content = value.toPrecision(1);
    });
    this.node.onMouseDrag = (event: paper.MouseEvent) => {
      this.node.position = this.node.position.add(event.delta);
      neuron.coordinate = event.point;
    };
    this.node.position = new paper.Point(neuron.coordinate);

    // "redirect" clicks to the main node
    this.circle.onClick = () => this.events.fire("click", this);
    this.number.onClick = () => this.events.fire("click", this);
  }

  get node(): paper.Group {
    return this._node;
  }
}
