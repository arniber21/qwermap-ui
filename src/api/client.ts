export function delay(min = 300, max = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export function fakeTxId(): string {
  let result = ''
  for (let i = 0; i < 44; i++) {
    result += BASE58_CHARS[Math.floor(Math.random() * BASE58_CHARS.length)]
  }
  return result
}

let idCounter = 100

export function nextPlaceId(): string {
  return `place-${String(++idCounter).padStart(3, '0')}`
}
