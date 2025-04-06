import { RotatingQuote } from "@/components/ui/rotating-quote";

// Restaurant and kitchen-related quotes
const quotes = [
  "The kitchen is the heart of the restaurant.",
  "Clean as you go, success will follow.",
  "Great food comes from a happy kitchen.",
  "Teamwork makes the dream work.",
  "A good dishwasher is the backbone of the kitchen.",
  "Order through chaos, perfection through repetition.",
  "Success comes from attention to detail.",
  "Respect your tools, respect your team.",
  "Every dish tells a story.",
  "A great meal starts with clean plates."
];

export default function QuoteBanner() {
  return (
    <div className="w-full bg-primary px-4 py-1.5 text-center">
      <RotatingQuote quotes={quotes} className="mx-auto" />
    </div>
  );
}