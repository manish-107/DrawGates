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

  render() {}
}

// "shapes": [
//   {
//     "id": 1,
//     "shapeName": "square",
//     "offset": { "x": 4, "y": 7 },
//     "dimensions": { "width": 50, "height": 50 },
//     "style": {
//       "fillColor": "#ff0000",
//       "strokeColor": "#000000",
//       "strokeWidth": 2
//     },
//     "connections": [
//       { "lineId": 1, "position": "top" },
//       { "lineId": 2, "position": "bottom" }
//     ],
//     "paths": [
//       {
//         "d": "M10 10 H 90 V 90 H 10 Z",
//         "fill": "none",
//         "stroke": "black"
//       }
//     ],
//     "metadata": { "label": "Input Gate", "tooltip": "This is a square gate" }
//   },
//   {
//     "id": 2,
//     "shapeName": "circle",
//     "offset": { "x": 10, "y": 15 },
//     "dimensions": { "radius": 25 },
//     "style": {
//       "fillColor": "#00ff00",
//       "strokeColor": "#000000",
//       "strokeWidth": 2
//     },
//     "connections": [
//       { "lineId": 3, "position": "left" },
//       { "lineId": 4, "position": "right" }
//     ],
//     "paths": [
//       {
//         "d": "M25,25 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0",
//         "fill": "none",
//         "stroke": "black"
//       }
//     ],
//     "metadata": { "label": "Output Gate", "tooltip": "This is a circle gate" }
//   }
// ]

// {
//   "lines": [
//     {
//       "id": 1,
//       "startPoint": {
//         "offset": { "x": 4, "y": 5 },
//         "gateId": 1,
//         "difference": { "x": 0, "y": 1 }
//       },
//       "endPoint": {
//         "offset": { "x": 10, "y": 8 },
//         "gateId": 2,
//         "difference": { "x": 0, "y": 1 }
//       }
//     },
//   ]
// }
