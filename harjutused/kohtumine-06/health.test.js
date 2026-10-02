import { describe, expect, it } from "vitest";
import { client } from "../tugi/client.js";

describe("GET /health", () => {
  it("vastab 200 ja { status: 'ok' }", async () => {
    const res = await client().get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
