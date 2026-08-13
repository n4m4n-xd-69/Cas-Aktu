#!/usr/bin/env node

import Sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, 'public', 'assets', 'brand');

const sources = [
  { input: 'cas.png', output: 'cas-116.png' },
  { input: 'aktu.png', output: 'aktu-116.png' },
];

async function processLogo(inputName, outputName) {
  const inputPath = path.join(brandDir, inputName);
  const outputPath = path.join(brandDir, outputName);

  console.log(`\n=== Processing ${inputName} -> ${outputName} ===`);

  // Try with palette: true first for smaller file size
  let image = Sharp(inputPath);
  let metadata = await image.metadata();
  console.log(
    `Input metadata: width=${metadata.width}, height=${metadata.height}, format=${metadata.format}, hasAlpha=${metadata.hasAlpha}, channels=${metadata.channels}`,
  );

  // Resize and compress with palette
  await image
    .resize(116, 116, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toFile(outputPath);

  // Check output metadata
  let outputImage = Sharp(outputPath);
  let outputMetadata = await outputImage.metadata();
  console.log(
    `Output metadata: width=${outputMetadata.width}, height=${outputMetadata.height}, format=${outputMetadata.format}, hasAlpha=${outputMetadata.hasAlpha}, channels=${outputMetadata.channels}`,
  );

  // Get file size
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${stats.size} bytes`);

  // Sample corner pixels to verify alpha
  const rawImage = await outputImage
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data, info } = rawImage;
  const bytesPerPixel = info.channels;

  // Corner pixels: (0,0), (115,0), (0,115), (115,115)
  const corners = [
    { name: '(0,0)', x: 0, y: 0 },
    { name: '(115,0)', x: 115, y: 0 },
    { name: '(0,115)', x: 0, y: 115 },
    { name: '(115,115)', x: 115, y: 115 },
  ];

  console.log(`Corner pixels (RGBA):`);
  for (const corner of corners) {
    const idx = (corner.y * 116 + corner.x) * bytesPerPixel;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = bytesPerPixel === 4 ? data[idx + 3] : 255;
    console.log(`  ${corner.name}: R=${r} G=${g} B=${b} A=${a}`);
  }

  // Verify pass conditions
  const passes =
    outputMetadata.width === 116 &&
    outputMetadata.height === 116 &&
    outputMetadata.hasAlpha === true &&
    outputMetadata.channels === 4 &&
    stats.size < 25600;

  console.log(
    `Pass condition (116x116, hasAlpha, channels=4, <25600 bytes): ${passes}`,
  );

  return {
    inputName,
    outputName,
    outputPath,
    outputMetadata,
    stats: { size: stats.size },
    passes,
  };
}

async function main() {
  console.log('Starting logo downscaling...\n');

  const results = [];
  for (const { input, output } of sources) {
    const result = await processLogo(input, output);
    results.push(result);
  }

  console.log('\n\n=== FINAL VERIFICATION ===\n');

  for (const result of results) {
    console.log(`\n${result.outputName}:`);
    console.log(
      `  Metadata: width=${result.outputMetadata.width}, height=${result.outputMetadata.height}, format=${result.outputMetadata.format}, hasAlpha=${result.outputMetadata.hasAlpha}, channels=${result.outputMetadata.channels}`,
    );
    console.log(`  File size: ${result.stats.size} bytes`);
    console.log(`  Status: ${result.passes ? 'PASS' : 'FAIL'}`);
  }

  console.log('\n\n=== DIRECTORY LISTING ===\n');
  const files = fs.readdirSync(brandDir).sort();
  for (const file of files) {
    const filePath = path.join(brandDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  ${file}: ${stats.size} bytes`);
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
