import { z } from 'zod';

export const MealSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required." }),
  summary: z
    .string()
    .trim()
    .min(1, { message: "Summary is required." }),
  instructions: z
    .string()
    .trim()
    .min(4, { message: "Instructions are required." }),
  image: z
    .custom((file) => {
      if (!file) return false;
      if (typeof file === "string") return true;
      if (file.size === 0) return false;
      return true;
    }, {
      message: "Image is required.",
    }),
});
