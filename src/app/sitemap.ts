import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://www.darlingtonwosa.art";

const ROUTES = [
  "",
  "/about",
  "/services",
  "/portfolio",
  "/shop",
  "/classes",
  "/classes/single-session",
  "/classes/monthly-package",
  "/classes/beginner-workshop",
  "/classes/group-session",
  "/classes/private-class",
  "/reviews",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
