import { PopularFundCard } from './PopularFundCard';

export const PopularFunds = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[180px] animate-pulse rounded-2xl border border-stroke-divider bg-layer1"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <PopularFundCard key={category.id} category={category} />
      ))}
    </div>
  );
};
