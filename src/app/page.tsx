import { redirect } from "next/navigation"
import { siteConfig } from "./siteConfig"

export default function HomePage() {
  redirect(siteConfig.baseLinks.overview)
}