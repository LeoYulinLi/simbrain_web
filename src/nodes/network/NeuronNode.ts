import { Neuron } from "../../model/network/Neuron";
import paper from "paper";
import eventEmitter from "../../events/emitter";
import ScreenElement from "./ScreenElement";

export class NeuronNode extends ScreenElement {

  private number = new paper.PointText(new paper.Point(0, 0));

  private circle = new paper.Shape.Circle(new paper.Point(0, 0), 12);

  private _node = new paper.Group([this.circle, this.number]);

  private nodeHandle = new paper.Shape.Rectangle(this.circle.bounds.size);

  private sourceHandle = new paper.Shape.Rectangle(this.circle.bounds.size);

  readonly events = eventEmitter<{
    selected: NeuronNode
  }>()

  constructor(readonly neuron: Neuron) {
    super();
    this.circle.strokeColor = new paper.Color("black");
    this.circle.fillColor = new paper.Color("#ffffff");

    this.number.content = this.neuron.value.toPrecision(1);
    this.number.justification = "center";
    this.number.fontSize = 11;
    this.number.fontFamily = "Arial";
    this.number.translate(new paper.Point(0, - this.number.position.y));

    this.nodeHandle.scale(1.2);
    this.nodeHandle.strokeColor = new paper.Color("green");
    this.nodeHandle.bounds.center = this.circle.bounds.center;
    this.node.addChild(this.nodeHandle);
    this.nodeHandle.visible = false;

    this.sourceHandle.scale(1.4);
    this.sourceHandle.strokeColor = new paper.Color("red");
    this.sourceHandle.bounds.center = this.circle.bounds.center;
    this.node.addChild(this.sourceHandle);
    this.sourceHandle.visible = false;

    neuron.events.on("value", value => {
      this.number.content = value.toPrecision(1);
    });
    this.node.onMouseDrag = (event: paper.MouseEvent) => {
      this.node.position = this.node.position.add(event.delta);
      neuron.coordinate = event.point;
    };
    this.node.position = new paper.Point(neuron.coordinate);
    this.node.on("hi", (obj: string[]) => console.log(JSON.stringify(obj)));
  }

  select(): void {
    this.nodeHandle.visible = true;
    this.events.fire("selected", this);
  }

  unselect(): void {
    this.nodeHandle.visible = false;
  }

  markAsSource(): void {
    this.sourceHandle.visible = true;
  }

  removeSource(): void {
    this.sourceHandle.visible = false;
  }

  get node(): paper.Group {
    return this._node;
  }
}
