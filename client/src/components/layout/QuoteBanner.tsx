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
  "A great meal starts with clean plates.",
  "The best ideas come from the dishpit.",
  "From chaos comes order, from order comes excellence.",
  "Every station depends on clean tools.",
  "Kitchen life is a team sport.",
  "Listen, learn, and level up every day."
];

export default function QuoteBanner() {
  return (
    <div className="w-full bg-primary px-4 py-2 text-center">
      <RotatingQuote 
        quotes={quotes} 
        className="mx-auto" 
        showIcon={true}
        interval={7000} // 7 seconds for each quote
      />
    </div>
  );
}