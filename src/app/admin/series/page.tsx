import { getAllSeries } from "@/lib/db/repository";
import { SeriesClient } from "./series-client";

export default async function AdminSeriesPage() {
  const seriesList = await getAllSeries();
  return <SeriesClient initialSeries={seriesList} />;
}
