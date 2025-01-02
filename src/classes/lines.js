class lines {
  constructor(svgContainer, lineId, x1, y1, x1, x2, stroke, strokeWidth) {
    this.svgContainer = svgContainer;
    this.x1 = x1;
    this.lineId = lineId;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.stroke = stroke || "black";
    this.strokeWidth = strokeWidth || "2";
  }

  setStartPoint(x1, y1) {
    this.x1 = x1;
    this.y1 = y1;
  }

  setEndPoint(x2, y2) {
    this.x2 = x2;
    this.y2 = y2;
  }

  setLineId(lineId) {
    this.lineId = lineId;
  }

  createLine() {
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.setAttribute("x1", this.x1);
    this.line.setAttribute("y1", this.y1);
    this.line.setAttribute("x2", this.x2);
    this.line.setAttribute("y2", this.y2);
    this.line.style.stroke = this.stroke;
    this.line.style.strokeWidth = this.strokeWidth;

    // Append to SVG Container
    this.svgContainer.appendChild(this.line);
  }
}
