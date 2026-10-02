import request from "supertest";
import { createApp } from "../../src/api/createApp.js";

export function client(options) {
  return process.env.TARGET_URL ? request(process.env.TARGET_URL) : request(createApp(options));
}
