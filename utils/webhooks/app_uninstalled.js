import prisma from "../prisma.js";

const appUninstallHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  try {
    JSON.parse(webhookRequestBody);

    await prisma.session.deleteMany({ where: { shop } });
    await prisma.stores.upsert({
      where: { shop },
      update: { isActive: false },
      create: { shop, isActive: false },
    });
  } catch (e) {
    console.error(e);
  }
};

export default appUninstallHandler;
