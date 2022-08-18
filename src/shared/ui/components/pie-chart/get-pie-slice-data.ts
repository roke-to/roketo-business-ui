export const getPieSliceData = (settings: {
  centreX: number;
  centreY: number;
  radius: number;
  startAngleRadians: number;
  sweepAngleRadians: number;
}): string => {
  let d = '';

  const firstCircumferenceX =
    settings.centreX + settings.radius * Math.cos(settings.startAngleRadians);
  const firstCircumferenceY =
    settings.centreY + settings.radius * Math.sin(settings.startAngleRadians);
  const secondCircumferenceX =
    settings.centreX +
    settings.radius * Math.cos(settings.startAngleRadians + settings.sweepAngleRadians);
  const secondCircumferenceY =
    settings.centreY +
    settings.radius * Math.sin(settings.startAngleRadians + settings.sweepAngleRadians);

  // move to centre
  d += `M${settings.centreX},${settings.centreY} `;
  // line to first edge
  d += `L${firstCircumferenceX},${firstCircumferenceY} `;
  // arc
  // @see https://svgwg.org/svg2-draft/paths.html#PathDataEllipticalArcCommands
  // Radius X, Radius Y, X Axis Rotation, Large Arc Flag, Sweep Flag, End X, End Y
  d += `A${settings.radius},${settings.radius} 0 ${
    settings.sweepAngleRadians <= Math.PI ? 0 : 1
  },1 ${secondCircumferenceX},${secondCircumferenceY} `;
  // close path
  d += 'Z';

  return d;
};
