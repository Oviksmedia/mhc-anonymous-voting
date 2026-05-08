import VotingSystem from "@/components/VotingSystem";

export const metadata = {
  title: "Nurses Week 2026 | Anonymous Voting",
  description: "Cast your anonymous vote for the Most Hardworking Nurse of 2026.",
};

export default function Home() {
  return (
    <main>
      <VotingSystem />
    </main>
  );
}
