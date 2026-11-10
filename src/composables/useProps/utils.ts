type PropValue = unknown

function valueOf(val: PropValue): any {
  if (val && typeof val === 'object' && 'current' in val) {
    val = (val as { current: unknown }).current
  }
  if (val && typeof val === 'object' && 'default' in val) {
    return (val as { default: unknown }).default
  }
  return val
}

export const isUndef = (v: string | string[] | number | boolean | object | undefined): boolean => v === undefined

export function resolvePropNum(val: PropValue, defVal: number): number {
  const realVal = valueOf(val)
  return isUndef(realVal) ? defVal : Number(realVal)
}

export function resolvePropColor(val: PropValue, def: string | string[]): string | string[] {
  const color = valueOf(val)
  if (Array.isArray(color)) {
    return color
  }

  return color ? String(color) : def
}

export function resolvePropString(val: PropValue, def: string): string {
  const v = valueOf(val)
  return isUndef(v) ? def : String(v)
}

export function resolvePropBool(val: PropValue, def: boolean): boolean {
  const v = valueOf(val)
  return isUndef(v) ? def : Boolean(v)
}
