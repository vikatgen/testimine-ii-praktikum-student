
let counter = 0;

export function uniqueTitle(prefix = "Töötuba") {
  counter += 1;
  return `${prefix} ${Date.now()}-${counter}`;
}

export function isoDaysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function uniqueEmail() {
  counter += 1;
  return `test-${Date.now()}-${counter}@example.ee`;
}

export async function createOpenWorkshop(api, { capacity = 10, basePrice = 20, startsInDays = 10 } = {}) {
  const created = await api.post("/workshops").send({
    title: uniqueTitle(),
    capacity,
    basePrice,
    startsAt: isoDaysFromNow(startsInDays),
  });
  if (created.status !== 201) throw new Error(`Töötoa loomine ebaõnnestus: ${created.status}`);
  const published = await api.post(`/workshops/${created.body.id}/publish`);
  if (published.status !== 200) throw new Error(`Töötoa avamine ebaõnnestus: ${published.status}`);
  return published.body;
}
