import { ScrapeRequest } from "types/request.type";
import { z } from "zod";

export const validateScrapeRequest = async(request: ScrapeRequest) => {
    try {
        const scheme = z.object({target: z.string(), })
    } catch (error) {
        throw new Error("Validate Scrape Request Error")
    }
}
