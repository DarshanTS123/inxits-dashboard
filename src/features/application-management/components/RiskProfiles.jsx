import { RiskProfileCard } from './RiskProfileCard';

export const RiskProfiles = ({ profiles = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[200px] animate-pulse rounded-2xl border border-stroke-divider bg-layer1"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {profiles.map((profile) => (
        <RiskProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
};
