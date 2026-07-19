import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const catalogPath = path.join(
  projectRoot,
  "src/data/loanBannerCatalog.json",
);
const outputDirectory = path.join(
  projectRoot,
  "public/assets/loan-banners/rendered",
);

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

const accents = {
  "personal-digital": "#2cc5ff",
  "education-future": "#54d6ff",
  "vehicle-mobility": "#56c2ff",
  "secured-assets": "#f4bd55",
  "home-property": "#45d2c1",
  "business-cashflow": "#45d6a7",
  "industrial-machinery": "#65b8ff",
  "agriculture-growth": "#80d177",
};

const familyImage = (family) =>
  path.join(
    projectRoot,
    `public/assets/loan-banners/${family}.jpg`,
  );

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const wrapText = (value, maximumCharacters) => {
  const words = String(value).trim().split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maximumCharacters || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  return lines;
};

const textLines = ({
  lines,
  x,
  y,
  fontSize,
  lineHeight,
  weight = 400,
  fill = "#ffffff",
  opacity = 1,
  letterSpacing = 0,
}) =>
  lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * (lineHeight || fontSize * 1.2)}" fill="${fill}" fill-opacity="${opacity}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="${weight}" letter-spacing="${letterSpacing}">${escapeXml(line)}</text>`,
    )
    .join("");

const desktopOverlay = (profile, slide) => {
  const accent = accents[profile.family] || "#2cc5ff";
  const isAssisted = slide === 2;
  const eyebrow = isAssisted
    ? `ASSISTED ${profile.name.toUpperCase()} JOURNEY`
    : profile.eyebrow;
  const title = isAssisted
    ? `Your ${profile.name} Journey, Made Simpler`
    : profile.title;
  const description = isAssisted
    ? "Check eligibility, prepare documents and compare partner options through one secure guided journey."
    : profile.description;
  const benefits = isAssisted
    ? ["30+ lending partners", "Secure profile", "Human assistance"]
    : profile.benefits;
  const primaryButton = isAssisted ? "Check Eligibility" : "Apply Now";
  const secondaryButton = isAssisted ? "View Documents" : "Calculate EMI";
  const titleLines = wrapText(title, 29);
  const titleY = 139;
  const descriptionY = titleY + (titleLines.length - 1) * 56 + 67;
  const descriptionLines = wrapText(description, 66).slice(0, 2);
  const benefitsY = descriptionY + (descriptionLines.length - 1) * 33 + 58;
  const buttonY = Math.max(493, benefitsY + 58);
  let pillX = 92;

  const benefitPills = benefits
    .map((benefit) => {
      const width = Math.max(156, Math.min(224, benefit.length * 10 + 58));
      const markup = `<g>
        <rect x="${pillX}" y="${benefitsY - 28}" width="${width}" height="42" rx="21" fill="#ffffff" fill-opacity="0.11" stroke="#ffffff" stroke-opacity="0.22"/>
        <circle cx="${pillX + 23}" cy="${benefitsY - 7}" r="10" fill="${accent}"/>
        <path d="M ${pillX + 18} ${benefitsY - 7} l 3.5 3.5 l 6 -7" fill="none" stroke="#07162d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="${pillX + 41}" y="${benefitsY}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700">${escapeXml(benefit)}</text>
      </g>`;
      pillX += width + 13;
      return markup;
    })
    .join("");

  return Buffer.from(`<svg width="1600" height="640" viewBox="0 0 1600 640" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="leftShade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#06152d" stop-opacity="0.94"/>
        <stop offset="0.48" stop-color="#06152d" stop-opacity="0.62"/>
        <stop offset="0.72" stop-color="#06152d" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="buttonFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${accent}"/>
        <stop offset="1" stop-color="#1686f0"/>
      </linearGradient>
      <filter id="buttonShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="9" stdDeviation="12" flood-color="#000000" flood-opacity="0.24"/>
      </filter>
    </defs>
    <rect width="1600" height="640" fill="url(#leftShade)"/>
    <rect x="92" y="70" width="38" height="4" rx="2" fill="${accent}"/>
    ${textLines({ lines: [eyebrow], x: 143, y: 80, fontSize: 17, weight: 700, fill: accent, letterSpacing: 1.8 })}
    ${textLines({ lines: titleLines, x: 92, y: titleY, fontSize: 47, lineHeight: 56, weight: 800 })}
    ${textLines({ lines: descriptionLines, x: 92, y: descriptionY, fontSize: 22, lineHeight: 33, weight: 400, opacity: 0.9 })}
    ${benefitPills}
    <g filter="url(#buttonShadow)">
      <rect x="92" y="${buttonY}" width="210" height="66" rx="14" fill="url(#buttonFill)"/>
      <text x="197" y="${buttonY + 41}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800">${escapeXml(primaryButton)}</text>
    </g>
    <rect x="320" y="${buttonY}" width="238" height="66" rx="14" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.76" stroke-width="2"/>
    <text x="439" y="${buttonY + 41}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800">${escapeXml(secondaryButton)}</text>
    <text x="92" y="615" fill="#ffffff" fill-opacity="0.62" font-family="Arial, Helvetica, sans-serif" font-size="14">Eligibility, rates and terms depend on the lending partner and applicant profile.</text>
  </svg>`);
};

const mobileOverlay = (profile, slide) => {
  const accent = accents[profile.family] || "#2cc5ff";
  const isAssisted = slide === 2;
  const eyebrow = isAssisted
    ? `ASSISTED ${profile.name.toUpperCase()} JOURNEY`
    : profile.eyebrow;
  const title = isAssisted
    ? `Your ${profile.name} Journey, Made Simpler`
    : profile.title;
  const description = isAssisted
    ? "Check eligibility, prepare documents and compare trusted partner options in one secure journey."
    : profile.description;
  const benefits = isAssisted
    ? ["30+ lending partners", "Human assistance"]
    : profile.benefits.slice(0, 2);
  const primaryButton = isAssisted ? "Check Eligibility" : "Apply Now";
  const secondaryButton = isAssisted ? "Documents" : "Calculate EMI";
  const titleLines = wrapText(title, 27).slice(0, 3);
  const titleY = 135;
  const descriptionY = titleY + (titleLines.length - 1) * 58 + 69;
  const descriptionLines = wrapText(description, 51).slice(0, 3);
  const benefitsY = descriptionY + (descriptionLines.length - 1) * 34 + 60;
  const buttonY = Math.max(510, benefitsY + 56);
  let pillX = 64;

  const benefitPills = benefits
    .map((benefit) => {
      const width = Math.max(245, Math.min(345, benefit.length * 13 + 76));
      const markup = `<g>
        <rect x="${pillX}" y="${benefitsY - 31}" width="${width}" height="48" rx="24" fill="#ffffff" fill-opacity="0.11" stroke="#ffffff" stroke-opacity="0.22"/>
        <circle cx="${pillX + 27}" cy="${benefitsY - 7}" r="11" fill="${accent}"/>
        <path d="M ${pillX + 21} ${benefitsY - 7} l 4 4 l 7 -8" fill="none" stroke="#07162d" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="${pillX + 48}" y="${benefitsY + 2}" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700">${escapeXml(benefit)}</text>
      </g>`;
      pillX += width + 16;
      return markup;
    })
    .join("");

  return Buffer.from(`<svg width="900" height="1050" viewBox="0 0 900 1050" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#06152d" stop-opacity="1"/>
        <stop offset="0.56" stop-color="#06152d" stop-opacity="1"/>
        <stop offset="0.75" stop-color="#06152d" stop-opacity="0.66"/>
        <stop offset="0.9" stop-color="#06152d" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="buttonFill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${accent}"/>
        <stop offset="1" stop-color="#1686f0"/>
      </linearGradient>
      <filter id="buttonShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="13" flood-color="#000000" flood-opacity="0.26"/>
      </filter>
    </defs>
    <rect x="0" y="0" width="900" height="700" fill="url(#topShade)"/>
    <rect x="64" y="65" width="42" height="5" rx="2.5" fill="${accent}"/>
    ${textLines({ lines: [eyebrow], x: 123, y: 78, fontSize: 21, weight: 700, fill: accent, letterSpacing: 1.5 })}
    ${textLines({ lines: titleLines, x: 64, y: titleY, fontSize: 49, lineHeight: 58, weight: 800 })}
    ${textLines({ lines: descriptionLines, x: 64, y: descriptionY, fontSize: 25, lineHeight: 34, weight: 400, opacity: 0.9 })}
    ${benefitPills}
    <g filter="url(#buttonShadow)">
      <rect x="64" y="${buttonY}" width="350" height="76" rx="16" fill="url(#buttonFill)"/>
      <text x="239" y="${buttonY + 48}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800">${escapeXml(primaryButton)}</text>
    </g>
    <rect x="432" y="${buttonY}" width="340" height="76" rx="16" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.76" stroke-width="2"/>
    <text x="602" y="${buttonY + 48}" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800">${escapeXml(secondaryButton)}</text>
    <text x="64" y="1018" fill="#ffffff" fill-opacity="0.78" font-family="Arial, Helvetica, sans-serif" font-size="17">Eligibility, rates and terms depend on the lending partner and applicant profile.</text>
  </svg>`);
};

const createDesktopBanner = async (profile, slide) => {
  const backgroundPath = familyImage(
    slide === 1 ? profile.family : "assisted-digital",
  );
  const outputPath = path.join(
    outputDirectory,
    `${profile.slug}-${String(slide).padStart(2, "0")}-desktop.webp`,
  );

  await sharp(backgroundPath)
    .resize(1600, 640, { fit: "cover", position: "centre" })
    .composite([{ input: desktopOverlay(profile, slide) }])
    .webp({ quality: 86, smartSubsample: true })
    .toFile(outputPath);

  return outputPath;
};

const createMobileBanner = async (profile, slide) => {
  const backgroundPath = familyImage(
    slide === 1 ? profile.family : "assisted-digital",
  );
  const outputPath = path.join(
    outputDirectory,
    `${profile.slug}-${String(slide).padStart(2, "0")}-mobile.webp`,
  );
  const imagePanel = await sharp(backgroundPath)
    .resize(900, 470, { fit: "cover", position: "east" })
    .toBuffer();

  await sharp({
    create: {
      width: 900,
      height: 1050,
      channels: 3,
      background: "#06152d",
    },
  })
    .composite([
      { input: imagePanel, left: 0, top: 580 },
      { input: mobileOverlay(profile, slide), left: 0, top: 0 },
    ])
    .webp({ quality: 86, smartSubsample: true })
    .toFile(outputPath);

  return outputPath;
};

await mkdir(outputDirectory, { recursive: true });

const manifest = [];
for (const profile of catalog) {
  for (const slide of [1, 2]) {
    const [desktopPath, mobilePath] = await Promise.all([
      createDesktopBanner(profile, slide),
      createMobileBanner(profile, slide),
    ]);
    manifest.push({
      productSlug: profile.slug,
      priority: slide,
      desktopImage: `/${path.relative(path.join(projectRoot, "public"), desktopPath)}`,
      mobileImage: `/${path.relative(path.join(projectRoot, "public"), mobilePath)}`,
    });
  }
}

await writeFile(
  path.join(outputDirectory, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  `Generated ${manifest.length} loan banners with desktop and mobile art direction.`,
);
