const queryConstructor = (filters) => {
  const query = {};

  if (filters.size && filters.size.length) {
    query.size = {
      $in: filters.size.map((size) => new RegExp(`^${size}$`, "i")),
    };
  }

  if (filters.price && filters.price.length) {
    const priceConditions = filters.price.map((range) => {
      try {
        const priceRange = JSON.parse(range); // Parse stringified range
        return { price: { $gte: priceRange.min, $lte: priceRange.max } };
      } catch (error) {
        console.error("Invalid price range:", range);
        return null; // Skip invalid ranges
      }
    }).filter(Boolean); // Remove null entries
    query.$or = priceConditions.length ? priceConditions : undefined;
  }

  if (filters.place && filters.place.length) {
    query.place = {
      $in: filters.place.map((place) => new RegExp(`^${place}$`, "i")),
    };
  }

  if (filters.rating && filters.rating.length) {
    query.rating = { $gte: Math.max(...filters.rating) }; // Use max rating
  }

  if (filters.category && filters.category.length) {
    query.category = {
      $in: filters.category.map((category) => new RegExp(`^${category}$`, "i")),
    };
  }

  return query;
};

module.exports = queryConstructor;
