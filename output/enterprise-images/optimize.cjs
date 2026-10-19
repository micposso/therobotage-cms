const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const images = [{"name":"enterprise-academy-hero","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-61668b53-665f-4fdb-a5dc-5de03d67fc8a.png"},{"name":"enterprise-factory-training","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-f8f532f2-e2ab-416d-ac09-5ff58f46cc07.png"},{"name":"enterprise-senior-living","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-7db086cc-f1b0-4f62-9534-470b1ed401da.png"},{"name":"enterprise-multilingual-training","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-2d7794eb-0ccc-496d-8c01-fdd4cfd00ece.png"},{"name":"enterprise-adoption-workplace","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-d4ccc95d-d3d2-4c01-9c5a-d8743466d01e.png"}];
(async () => {
  await fs.mkdir('output/enterprise-images/originals', {recursive:true});
  await fs.mkdir('frontend/public/images/enterprise', {recursive:true});
  for (const image of images) {
    await fs.copyFile(image.path, `output/enterprise-images/originals/${image.name}.png`);
    const result = await sharp(image.path).webp({quality:85, effort:6}).toFile(`frontend/public/images/enterprise/${image.name}.webp`);
    console.log(image.name, result.width, result.height, result.size);
  }
})();
