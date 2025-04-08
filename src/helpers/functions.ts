export type Range = { min: number; max: number }
export function remap(value: number, oldRange: Range, newRange: Range) {
  const oldR = (oldRange.max - oldRange.min)
  if (oldR === 0) return (newRange.max + newRange.min) / 2

  const newR = newRange.max - newRange.min

  return (((value - oldRange.min) * newR) / oldR) + newRange.min
}
