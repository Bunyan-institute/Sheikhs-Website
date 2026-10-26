import { getAllSeries } from "@/lib/db/repository";
import { SeriesClient } from "./series-client";

export default function AdminSeriesPage() {
  const seriesList = getAllSeries();
  return <SeriesClient initialSeries={seriesList} />;
}
