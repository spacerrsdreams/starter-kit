export function formatResendTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainderSeconds = seconds % 60

  return `${minutes}:${remainderSeconds.toString().padStart(2, "0")}`
}
