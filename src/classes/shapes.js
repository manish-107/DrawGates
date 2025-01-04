export default class Shapes {
  constructor({ svgId, svgName, x, y, style, dimensions, paths }) {
    this.svgId = svgId;
    this.svgName = svgName;
    this.x = x || 0;
    this.y = y || 0;
    this.strokeColor = style.strokeColor || "#444";
    this.fillColor = style.fillColor || "#000";
    this.strokeWidth = style.strokeWidth || 1;
    this.width = dimensions.width || 48;
    this.height = dimensions.height || 48;
    this.paths = paths;
    this.scaleFactor = 2;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setId(svgId) {
    this.svgId = svgId;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  setColor(color) {
    this.fillColor = color;
  }

  setScale(scaleFactor) {
    this.scaleFactor = scaleFactor;
  }

  render(svgContainer) {
    const existingGroup = svgContainer.querySelector(
      `[data-svg-id="${this.svgId}"]`
    );
    if (existingGroup) {
      existingGroup.setAttribute(
        "transform",
        `translate(${this.x}, ${this.y}) scale(${this.scaleFactor})`
      );
      return;
    }

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute(
      "transform",
      `translate(${this.x}, ${this.y}) scale(${this.scaleFactor})`
    );
    group.setAttribute("data-svg-id", this.svgId);

    let isDragging = false;
    let startX, startY, initialX, initialY;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      const transform = group.getAttribute("transform");
      const translateMatch = /translate\(([\d.]+),\s*([\d.]+)\)/.exec(
        transform
      );
      initialX = translateMatch ? parseFloat(translateMatch[1]) : this.x;
      initialY = translateMatch ? parseFloat(translateMatch[2]) : this.y;

      svgContainer.addEventListener("mousemove", onMouseMove);
      svgContainer.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      group.setAttribute(
        "transform",
        `translate(${newX}, ${newY}) scale(${this.scaleFactor})`
      );
    };

    const onMouseUp = () => {
      isDragging = false;
      svgContainer.removeEventListener("mousemove", onMouseMove);
      svgContainer.removeEventListener("mouseup", onMouseUp);
    };

    const onClick = () => {
      console.log(`SVG ID: ${this.svgId} clicked`);
    };

    group.addEventListener("mousedown", onMouseDown);
    group.addEventListener("click", onClick);

    this.paths.forEach((path) => {
      const pathElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      Object.entries(path).forEach(([key, value]) => {
        pathElement.setAttribute(key, value);
      });
      group.appendChild(pathElement);
    });

    svgContainer.appendChild(group);
  }
}
