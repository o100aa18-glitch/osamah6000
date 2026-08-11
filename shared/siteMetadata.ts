export const siteMetadata = {
  name: "أسامة مبارك البعوي",
  title: "مهندس متخصص",
  description: "متخصص في خدمات الكهرباء والسباكة والتكييف والكاميرات",
  shareDescription: "خدمات الكهرباء والسباكة والتكييف والكاميرات، بخبرة هندسية وحلول موثوقة.",
  profileImageUrl:
    "https://files.manuscdn.com/user_upload_by_module/session_file/310519663816443346/PAJWkVOQNmXHZgbg.png",
  featuredServices: ["الكهرباء", "السباكة", "التكييف", "الكاميرات"],
} as const;

const previewSource = JSON.stringify(siteMetadata);

export const siteShareVersion = Array.from(previewSource).reduce(
  (hash, character) => ((hash * 31 + character.charCodeAt(0)) >>> 0),
  7,
).toString(36);
