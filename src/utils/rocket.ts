export function stepRocketPosition(
  currentY: number,
  speed: number,
  delta: number,
  targetHeight: number
): { newY: number; exploded: boolean } {
  const newY = currentY + speed * delta;
  const exploded = newY >= targetHeight;
  return { newY, exploded };
}
