import { prisma } from "../lib/prisma";

async function main() {
  const r = await prisma.report.findFirst({ orderBy: { createdAt: "desc" } });
  console.log(JSON.stringify(r, null, 2));
}

main()
  .finally(() => prisma.$disconnect());