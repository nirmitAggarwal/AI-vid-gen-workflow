// Example scenes — Editorial Magazine.
// The same subject ("how a distributed system assigns work to multiple
// computers") staged as a cover, a feature spread, a column piece and a
// pull-quote page. Structure is data; the layout does the art direction.

import React from "react";
import { MagazineScene, type MagazineSceneData, type MagazineSceneProps } from "./scene";

/** Cover — masthead, giant masked headline, standfirst on tint. */
export const coverSpreadData: MagazineSceneData = {
  layout: "cover",
  kicker: "Issue 04 · Systems",
  masthead: { title: "The Dispatch", issue: "Autumn 2026" },
  headline: "One job in.\nMachines out.",
  standfirst: "How a coordinator quietly splits one impossible job across a room full of computers.",
  photo: { tone: "blue", caption: "A queue, a handful of workers, one merged result." },
  folio: { page: "01", section: "Distributed Systems" },
};

/** Feature — rubric, headline beside a photo, drop-capped columns. */
export const featureSpreadData: MagazineSceneData = {
  layout: "feature",
  kicker: "Distributed Systems",
  headline: "Nobody holds\nthe whole job.",
  standfirst: "The coordinator splits the work; workers return results; nobody ever sees the entire picture.",
  body:
    "A coordinator accepts the job, cuts it into tasks, and hands each task to a worker that has spare capacity. Workers report back in fragments. The coordinator merges those fragments into one result and answers the caller. The trick is not cleverness at any single step; it is keeping every step small enough that failure at one of them is survivable and retryable.",
  photo: { tone: "ink", caption: "Fig. 1 — tasks fan out, results fan back in." },
  folio: { page: "24", section: "Feature" },
};

/** Columns — article body with drop cap and pull quote. */
export const columnSpreadData: MagazineSceneData = {
  layout: "columns",
  kicker: "Explainer",
  headline: "Split. Run. Merge.",
  standfirst: "Three verbs describe most of what happens inside a distributed system.",
  body:
    "Split means dividing a request into independent units of work that never need to talk to each other. Run means dispatching those units to whichever machine is free, close to its data, or cheapest at that moment. Merge means folding the partial answers back together in an order that produces the same final answer every time. When one machine dies mid-run, only its unit is re-dispatched; the rest of the job never notices.",
  pullQuote: "Failure at one step is survivable and retryable.",
  folio: { page: "56", section: "Explainer" },
};

/** Quote page — the pull quote owns the spread. */
export const quoteSpreadData: MagazineSceneData = {
  layout: "quote",
  kicker: "In Context",
  headline: "On handing work away",
  pullQuote: "Nobody holds the whole job — that is the entire point.",
  standfirst: "The coordinator stays small so the system can get big.",
  photo: { tone: "red", caption: "Partial answers, one result." },
  folio: { page: "78", section: "In Context" },
};

/** Default export — the feature spread (the style's home layout). */
export const ExampleScene: React.FC<MagazineSceneProps> = (props) => (
  <MagazineScene {...props} data={{ ...featureSpreadData, ...props.data }} />
);

export const CoverExample: React.FC<MagazineSceneProps> = (props) => (
  <MagazineScene {...props} data={{ ...coverSpreadData, ...props.data }} />
);

export const ColumnsExample: React.FC<MagazineSceneProps> = (props) => (
  <MagazineScene {...props} data={{ ...columnSpreadData, ...props.data }} />
);

export const QuoteExample: React.FC<MagazineSceneProps> = (props) => (
  <MagazineScene {...props} data={{ ...quoteSpreadData, ...props.data }} />
);
