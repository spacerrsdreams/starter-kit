const MAX_AVATAR_FILE_SIZE_BYTES = 2 * 1024 * 1024

export function getUserInitial(email: string | undefined): string {
  const value = email?.trim()
  if (!value) return "U"
  return value[0]?.toUpperCase() ?? "U"
}

export function splitUserName(name: string | null | undefined): { firstName: string; lastName: string } {
  if (!name) {
    return {
      firstName: "",
      lastName: "",
    }
  }

  const trimmedName = name.trim()
  if (!trimmedName) {
    return {
      firstName: "",
      lastName: "",
    }
  }

  const [firstName = "", ...rest] = trimmedName.split(/\s+/)

  return {
    firstName,
    lastName: rest.join(" "),
  }
}

export function getAvatarSizeError(file: File): string | null {
  if (file.size <= MAX_AVATAR_FILE_SIZE_BYTES) {
    return null
  }

  return "Profile photo must be 2MB or smaller."
}

export function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error("Failed to read file."))
    reader.readAsDataURL(file)
  })
}
