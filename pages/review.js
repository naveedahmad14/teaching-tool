import Layout from "@/components/layout/Layout";
import ReviewSession from "@/components/features/SpacedRepetition/ReviewSession";

export default function ReviewPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#FFD700]">
          Spaced review
        </h1>
        <p className="text-[#E8E8E8] mb-8">
          Review lessons you’ve learned. Rate how well you remember each one to schedule the next review.
        </p>
        <ReviewSession />
      </div>
    </Layout>
  );
}
