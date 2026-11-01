import type { ListResponse, SearchResult } from "./types";
import {
  getAllLectures,
  getAllArticles,
  getAllBooks,
  getAllFatwas,
  getAllCourses,
  getAllEvents,
  getAllSeries,
} from "@/lib/db/repository";
import { AUTHENTIC_LECTURES } from "./lectures";
import { AUTHENTIC_ARTICLES } from "./articles";
import { AUTHENTIC_BOOKS } from "./library";
import { AUTHENTIC_FATWAS } from "./fatwas";
import { AUTHENTIC_COURSES } from "./courses";
import { AUTHENTIC_EVENTS } from "./events";
import { AUTHENTIC_SERIES } from "./series";

export async function searchContent(params: {
  q: string;
  type?: string[];
  limit?: string;
  locale?: string;
}): Promise<ListResponse<SearchResult>> {
  const q = (params.q || "").toLowerCase().trim();
  const results: SearchResult[] = [];

  if (!q) {
    return {
      object: "list",
      data: [],
      has_more: false,
      next_cursor: null,
    };
  }

  // Load from local database first, fall back to authentic hardcoded list
  let lectures = [];
  try {
    lectures = getAllLectures();
  } catch {
    lectures = AUTHENTIC_LECTURES;
  }
  if (!lectures || lectures.length === 0) lectures = AUTHENTIC_LECTURES;

  for (const lec of lectures) {
    if (
      lec.title.toLowerCase().includes(q) ||
      (lec.summary && lec.summary.toLowerCase().includes(q))
    ) {
      results.push({
        object: "lecture",
        id: lec.id,
        title: lec.title,
        slug: lec.slug,
        summary: lec.summary,
        locale: lec.locale,
        score: 1.0,
        published_at: lec.published_at,
      });
    }
  }

  let articles = [];
  try {
    articles = getAllArticles();
  } catch {
    articles = AUTHENTIC_ARTICLES;
  }
  if (!articles || articles.length === 0) articles = AUTHENTIC_ARTICLES;

  for (const art of articles) {
    if (
      art.title.toLowerCase().includes(q) ||
      (art.summary && art.summary.toLowerCase().includes(q))
    ) {
      results.push({
        object: "article",
        id: art.id,
        title: art.title,
        slug: art.slug,
        summary: art.summary,
        locale: art.locale,
        score: 1.0,
        published_at: art.published_at,
      });
    }
  }

  let books = [];
  try {
    books = getAllBooks();
  } catch {
    books = AUTHENTIC_BOOKS;
  }
  if (!books || books.length === 0) books = AUTHENTIC_BOOKS;

  for (const book of books) {
    if (
      book.title.toLowerCase().includes(q) ||
      (book.summary && book.summary.toLowerCase().includes(q))
    ) {
      results.push({
        object: "book",
        id: book.id,
        title: book.title,
        slug: book.slug,
        summary: book.summary,
        locale: book.locale,
        score: 1.0,
        published_at: book.published_at,
      });
    }
  }

  let fatwas = [];
  try {
    fatwas = getAllFatwas();
  } catch {
    fatwas = AUTHENTIC_FATWAS;
  }
  if (!fatwas || fatwas.length === 0) fatwas = AUTHENTIC_FATWAS;

  for (const fatwa of fatwas) {
    if (
      fatwa.title.toLowerCase().includes(q) ||
      (fatwa.summary && fatwa.summary.toLowerCase().includes(q)) ||
      (fatwa.question && fatwa.question.toLowerCase().includes(q))
    ) {
      results.push({
        object: "fatwa",
        id: fatwa.id,
        title: fatwa.title,
        slug: fatwa.slug,
        summary: fatwa.summary,
        locale: fatwa.locale,
        score: 1.0,
        published_at: fatwa.published_at,
      });
    }
  }

  let courses = [];
  try {
    courses = getAllCourses();
  } catch {
    courses = AUTHENTIC_COURSES;
  }
  if (!courses || courses.length === 0) courses = AUTHENTIC_COURSES;

  for (const course of courses) {
    if (
      course.title.toLowerCase().includes(q) ||
      (course.summary && course.summary.toLowerCase().includes(q))
    ) {
      results.push({
        object: "course",
        id: course.id,
        title: course.title,
        slug: course.slug,
        summary: course.summary,
        locale: course.locale,
        score: 1.0,
        published_at: null,
      });
    }
  }

  let seriesList = [];
  try {
    seriesList = getAllSeries();
  } catch {
    seriesList = AUTHENTIC_SERIES;
  }
  if (!seriesList || seriesList.length === 0) seriesList = AUTHENTIC_SERIES;

  for (const ser of seriesList) {
    if (
      ser.title.toLowerCase().includes(q) ||
      (ser.description && ser.description.toLowerCase().includes(q))
    ) {
      results.push({
        object: "series",
        id: ser.id,
        title: ser.title,
        slug: ser.slug,
        summary: ser.description,
        locale: ser.locale,
        score: 1.0,
        published_at: ser.published_at,
      });
    }
  }

  let events = [];
  try {
    events = getAllEvents();
  } catch {
    events = AUTHENTIC_EVENTS;
  }
  if (!events || events.length === 0) events = AUTHENTIC_EVENTS;

  for (const ev of events) {
    if (
      ev.title.toLowerCase().includes(q) ||
      (ev.summary && ev.summary.toLowerCase().includes(q))
    ) {
      results.push({
        object: "event",
        id: ev.id,
        title: ev.title,
        slug: ev.slug,
        summary: ev.summary,
        locale: ev.locale,
        score: 1.0,
        published_at: ev.starts_at,
      });
    }
  }

  const filtered =
    params.type && params.type.length > 0
      ? results.filter((r) => params.type!.includes(r.object))
      : results;

  return {
    object: "list",
    data: filtered.slice(0, Number(params.limit ?? 20)),
    has_more: false,
    next_cursor: null,
  };
}
