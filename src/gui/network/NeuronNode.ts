import { Neuron } from "../../model/network/Neuron";
import paper from "paper";
import eventEmitter from "../../events/emitter";
import ScreenElement from "./ScreenElement";

export class NeuronNode extends ScreenElement {

  readonly node: paper.Group;
  private readonly number: paper.PointText;
  private readonly circle: paper.Shape.Circle;
  private readonly nodeHandle: paper.Shape.Rectangle;
  private readonly sourceHandle: paper.Shape.Rectangle;

  readonly events = eventEmitter<{
    selected: any
  }>()

  constructor(readonly neuron: Neuron) {
    super();

    this.node = new paper.Group();

    this.circle = new paper.Shape.Circle({
      point: [0, 0],
      radius: 12,
      strokeColor: "#317BAC",
      fillColor: this.activationColor,
      insert: false
    });
    this.node.addChild(this.circle);

    this.number = new paper.PointText({
      point: [0, 0],
      insert: false,
      content: this.neuron.value.toPrecision(1),
      justification: "center",
      fontSize: 11,
      fontFamily: "Arial"
    });
    this.number.translate(new paper.Point(0, - this.number.position.y));
    this.node.addChild(this.number);

    this.nodeHandle = new paper.Shape.Rectangle({
      size: this.circle.bounds.size,
      strokeColor: "green",
      position: this.circle.bounds.center,
      insert: false
    });
    this.nodeHandle.scale(1.2);
    this.node.addChild(this.nodeHandle);
    this.nodeHandle.visible = false;

    this.sourceHandle = new paper.Shape.Rectangle({
      size: this.circle.bounds.size,
      strokeColor: "red",
      position: this.circle.bounds.center,
      insert: false
    });
    this.sourceHandle.scale(1.4);
    this.node.addChild(this.sourceHandle);
    this.sourceHandle.visible = false;

    neuron.events.on("value", value => {
      this.number.content = (Math.round(value * 10) / 10).toPrecision(1);
      this.circle.fillColor = this.activationColor;
    });

    neuron.events.on("location", location => {
      this.node.position = new paper.Point(location);
    });

    this.node.on("mousedown", this.select.bind(this));

    this.neuron.events.on("selected", (tag) => this.select(tag));

    this.node.on("select", this.select.bind(this));

    this.node.position = new paper.Point(neuron.coordinate);
  }

  select(tag?: any): void {
    this.nodeHandle.visible = true;
    this.events.fire("selected", tag);
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

  increaseActivation(): void {
    this.neuron.value += 0.1;
  }

  decreaseActivation(): void {
    this.neuron.value -= 0.1;
  }

  private get activationColor(): paper.Color {
    const { value, updateRule: { graphicalUpperBound, graphicalLowerBound, graphicalNeutral } } = this.neuron;
    if (value > graphicalNeutral) {
      const saturation = 1 - (graphicalUpperBound - value) / (graphicalUpperBound - graphicalNeutral);
      const color = new paper.Color("red");
      color.saturation = saturation;
      color.brightness = 1;
      return color;
    } else {
      const saturation = 1 - (value - graphicalLowerBound) / (graphicalNeutral - graphicalLowerBound);
      const color = new paper.Color("blue");
      color.saturation = saturation;
      color.brightness = 1;
      return color;
    }
  }

  delete(): void {
    this.neuron.delete();
  }

  intersects(selection: paper.Shape.Rectangle): boolean {
    return this.circle.intersects(selection) || this.circle.isInside(selection.bounds);
  }

}
