const fs = require('fs/promises');
const sharp = require('sharp');
const images = [{"name":"enterprise-humanoid-onboarding","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-80d1e85f-4cea-4fe4-8cad-75a0fe7a5992.png"},{"name":"enterprise-quadruped-inspection","path":"C:\\Users\\micpo\\.codex\\generated_images\\01a1506f-55b4-7873-8fcd-8a51d156ce1c\\exec-d2488f46-7669-4ef8-b0d1-9f0f11f69959.png"}];
(async()=>{for(const image of images){await fs.copyFile(image.path, `output/enterprise-images/originals/${image.name}.png`);console.log(await sharp(image.path).webp({quality:85,effort:6}).toFile(`frontend/public/images/enterprise/${image.name}.webp`));}})();
