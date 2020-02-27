const ChartjsNode = require('chartjs-node');

/* eslint-disable id-length */
function HSVtoRGB(hue, saturation, value) {
  let red, green, blue;
  const normalizeHue = hue * 6; 
  const closestHex = Math.floor(normalizeHue); // i
  const remainder = normalizeHue - closestHex; // f
  const baseSaturation = value * (1 - saturation); // pp
  const rising = value * (1 - remainder * saturation); // qq
  const falling = value * (1 - (1 - remainder) * saturation); // tt
  switch (closestHex % 6) {
    case 0: 
      red = value;
      green = falling;
      blue = baseSaturation; 
      break;
    case 1: 
      red = rising;
      green = value;
      blue = baseSaturation; 
      break;
    case 2: 
      red = baseSaturation;
      green = value;
      blue = falling;
      break;
    case 3:
      red = baseSaturation;
      green = rising;
      blue = value;
      break;
    case 4:
      red = falling;
      green = baseSaturation;
      blue = value;
      break;
    case 5:
      red = value;
      green = baseSaturation; 
      blue = rising; 
      break;
    default: 
      red = 1;
      green = 1;
      blue = 1;
      break;
  }
  return {
    r: Math.round(red * 255),
    g: Math.round(green * 255),
    b: Math.round(blue * 255)
  };
}

function generateChart(name, title, labels, datasets, logger) {
  const width = 800;
  const height = 600;
  const chartNode = new ChartjsNode(width, height);
  const chartOptions = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      title: {
        display: true,
        text: title
      },
      scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
    },
    plugins: {
      // Fill background white before draw
      beforeDraw: ((chart) => {
        const ctx = chart.chart.ctx;
        const currStyle = ctx.fillStyle;
        ctx.fillStyle = 'rgba(255,255,255,255)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = currStyle;
      })
    }
  };
  const chartName = `./images/${name}-Chart.png`;
  logger.info(`Creating ${name} Chart...`);
  const firstChartOptions = Object.assign({}, chartOptions);
  return chartNode.drawChart(firstChartOptions)
    .then(() => {
      return chartNode.getImageBuffer('image/png');
    })
    .then((buffer) => {
      return chartNode.getImageStream('image/png');
    })
    .then((stream) => {
      return chartNode.writeImageToFile('image/png', chartName);
    })
    .then(() => {
      chartNode.destroy();
      return;
    });
}


module.exports = { generateChart, HSVtoRGB };
