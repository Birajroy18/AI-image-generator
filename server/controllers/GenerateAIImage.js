import * as dotenv from "dotenv";
import { InferenceClient } from "@huggingface/inference";
import { createError } from "../error.js";

dotenv.config();

const hfToken = process.env.HUGGINGFACE_TOKEN || process.env.HF_TOKEN;
const hfModelId =
  process.env.HF_MODEL_ID || "black-forest-labs/FLUX.1-dev";

const hfClient = hfToken ? new InferenceClient(hfToken) : null;

// Controller to generate Image using Hugging Face Inference Providers
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return next(createError(400, "Prompt is required"));
    }

    if (!hfToken || !hfClient) {
      return next(
        createError(
          500,
          "HUGGINGFACE_TOKEN or HF_TOKEN is not set in the server environment."
        )
      );
    }

    const imageBlob = await hfClient.textToImage({
      model: hfModelId,
      inputs: prompt,
      provider: "hf-inference" //free 
    });

    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    if (!base64Image) {
      return next(
        createError(500, "No image was generated. Try a different prompt.")
      );
    }

    return res.status(200).json({ photo: base64Image });
  } catch (error) {
    const message =
      error?.message ||
      error?.cause?.message ||
      (typeof error?.toString === "function"
        ? error.toString()
        : "Image generation failed");
    const status = error?.status || error?.cause?.status || 500;
    next(createError(status, message));
  }
};
