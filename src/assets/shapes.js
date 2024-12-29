class shapes {
  constructor({
    id,
    width,
    fillColor,
    strokewidth,
    height,
    name,
    x,
    y,
    color,
    paths = [],
  }) {
    this.width = width || 48;
    this.height = height || 48;
    this.name = name;
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || "#444";
    this.paths = paths;
    this.id = id;
    this.fillColor = fillColor | "#000";
    this.strokewidth = strokewidth || 1;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setId(id) {
    this.id = id;
  }

  reSize(width, height) {
    this.width = width;
    this.height = height;
  }

  setColor(color) {
    this.color = color;
  }

  scalePath(scaleFactor) {
    this.paths = this.paths.map((path) => {
      const newPath = { ...path };
      if (newPath.d) {
        newPath.d = this.scalePathData(newPath.d, scaleFactor);
      }
      return newPath;
    });
  }

  scalePathData(pathData, scaleFactor) {
    return pathData.replace(/(\d+(\.\d+)?)/g, (match) => {
      return parseFloat(match) * scaleFactor;
    });
  }

  toSVG() {
    const svgPaths = this.paths
      .map((path) => {
        const attributes = Object.entries(path)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");
        return `<path ${attributes} />`;
      })
      .join("\n");
    return `<svg id="${this.id}" x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg" fill=${this.color} stroke-width=${this.strokewidth} stroke=${this.color}>
      ${svgPaths}
    </svg>`;
  }
}
