
export function sanitize(name: string) {

  return name.replace(/[<>:"/\\|?*]+/g, "").trim()
}