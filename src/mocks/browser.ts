import { setupWorker } from "msw/browser";
import { authHandler } from "./handlers/authHandler";

export const worker = setupWorker(...authHandler);