export function isEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value)
}

export function isPasswordStrong(value: string): boolean {
  // minimal example: at least 6 chars
  return value.length >= 6
}
