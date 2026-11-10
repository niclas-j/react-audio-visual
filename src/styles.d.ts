/// <reference types="vitest/globals" />
declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.css" {}
declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.scss" {}
declare module "*.module.sass" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.sass" {}
declare module "*.module.less" {
  const classes: Record<string, string>;
  export default classes;
}
declare module "*.less" {}
declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.jpeg" {
  const src: string;
  export default src;
}
declare module "*.gif" {
  const src: string;
  export default src;
}
declare module "*.webp" {
  const src: string;
  export default src;
}
declare module "*.avif" {
  const src: string;
  export default src;
}
declare module "*.ico" {
  const src: string;
  export default src;
}
declare module "*.woff" {
  const src: string;
  export default src;
}
declare module "*.woff2" {
  const src: string;
  export default src;
}
declare module "*.ttf" {
  const src: string;
  export default src;
}
declare module "*.eot" {
  const src: string;
  export default src;
}
declare module "*?url" {
  const src: string;
  export default src;
}

interface ImportMeta {
  readonly env: Record<string, any>;
}
