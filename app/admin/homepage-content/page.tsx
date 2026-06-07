import type { Metadata } from "next";
import HomePageContentClient from "./HomePageContentClient";

export const metadata: Metadata = { title: "Home Page Content — Admin" };

export default function AdminHomePageContentPage() {
  return <HomePageContentClient />;
}
