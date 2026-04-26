import "server-only"

import { tool } from "ai"
import { z } from "zod"

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const weatherTool = tool({
  description: "Get the weather in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => {
    await sleep(2500)
    return {
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }
  },
})

const hikePlanerTool = tool({
  description: "Plan a hike in a location",
  inputSchema: z.object({
    location: z.string().describe("The location to plan a hike for"),
  }),
  execute: async ({ location }) => {
    await sleep(2000)
    return {
      location,
      hikePlan: "Hike plan for " + location + " is to hike the Mtatsminda mountain and then come back.",
    }
  },
})

export const chatTools = {
  weather: weatherTool,
  hikePlaner: hikePlanerTool,
}
