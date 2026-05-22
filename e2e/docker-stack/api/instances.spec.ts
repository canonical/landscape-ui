import { expect, test } from "@playwright/test";

test.describe("Instances API Contract", () => {
  test("GET /api/v2/computers returns valid list shape", async ({ request }) => {
    const res = await request.get("/api/v2/computers");
    expect(res.ok()).toBeTruthy();
    
    const body = await res.json();
    expect(body).toHaveProperty("results");
    expect(Array.isArray(body.results)).toBe(true);
    if (body.results.length > 0) {
      expect(body.results[0]).toHaveProperty("id");
      expect(body.results[0]).toHaveProperty("title");
    }
  });

  test("PUT /api/v2/computers/:id updates instance", async ({ request }) => {
    const listRes = await request.get("/api/v2/computers");
    expect(listRes.ok()).toBeTruthy();
    const listBody = await listRes.json();
    
    if (listBody.results && listBody.results.length > 0) {
      const instanceId = listBody.results[0].id;
      const originalTitle = listBody.results[0].title;
      const newTitle = `Updated ${Date.now()}`;
      
      const putRes = await request.put(`/api/v2/computers/${instanceId}`, {
        data: { title: newTitle }
      });
      expect(putRes.ok(), `PUT failed: ${putRes.status()} ${await putRes.text()}`).toBeTruthy();
      
      // Restore
      await request.put(`/api/v2/computers/${instanceId}`, {
        data: { title: originalTitle }
      });
    }
  });
});
