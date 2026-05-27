import { MfCollectionCard } from './MfCollectionCard';

export const MfCollections = ({ collections = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
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
      {collections.map((collection) => (
        <MfCollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};
