import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current filter values from URL
  const currentFilters = useMemo(() => {
    const params = Object.fromEntries([...searchParams]);
    return {
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      maxPrice: params.maxPrice !== undefined ? +params.maxPrice : 3000,
    };
  }, [searchParams]);

  const priceRange = useMemo(() => {
    const params = Object.fromEntries([...searchParams]);
    return [0, params.maxPrice !== undefined ? +params.maxPrice : 3000];
  }, [searchParams]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const newPrice = e.target.value;

    // Only add maxPrice to URL if it's not the default value (3000)
    if (newPrice !== "3000") {
      params.set("maxPrice", newPrice);
    } else {
      params.delete("maxPrice");
    }

    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const genders = ["Men", "Women"];
  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];


  return (
    <div className="p-6 bg-winterella-black text-white min-h-full">
      <h3 className="text-3xl font-oswald uppercase mb-10 tracking-tighter border-b border-gray-700 pb-4">
        Filters
      </h3>

      {/* Category Filter */}
      <div className="mb-10 text-white font-medium">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Category
        </h3>
        {categories.map((category) => (
          <div
            key={category}
            className={`flex justify-between items-center mb-4 cursor-pointer hover:text-winterella-red transition-colors ${currentFilters.category === category ? "text-winterella-red" : ""}`}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (params.get("category") === category) {
                params.delete("category");
              } else {
                params.set("category", category);
              }
              setSearchParams(params);
              navigate(`?${params.toString()}`);
            }}
          >
            <span className="text-lg">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-10 text-white font-medium">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Gender
        </h3>
        {genders.map((gender) => (
          <div
            key={gender}
            className={`flex justify-between items-center mb-4 cursor-pointer hover:text-winterella-red transition-colors ${currentFilters.gender === gender ? "text-winterella-red" : ""}`}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (params.get("gender") === gender) {
                params.delete("gender");
              } else {
                params.set("gender", gender);
              }
              setSearchParams(params);
              navigate(`?${params.toString()}`);
            }}
          >
            <span className="text-lg">{gender}</span>
          </div>
        ))}
      </div>

      {/* Price Range Filter */}
      <div className="mb-10">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Price
        </h3>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={3000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-1 bg-gray-600 rounded-none appearance-none cursor-pointer mb-6 accent-white"
        />
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Min price</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={0}
                readOnly
                className="w-full bg-transparent border border-gray-700 p-2 pl-7 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Max price</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  params.set("maxPrice", e.target.value);
                  setSearchParams(params);
                  navigate(`?${params.toString()}`);
                }}
                className="w-full bg-transparent border border-gray-700 p-2 pl-7 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-10">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Size
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                const currentValue = params.get("size");
                const arrayValue = currentValue ? currentValue.split(",") : [];
                if (arrayValue.includes(size)) {
                  const newArray = arrayValue.filter((s) => s !== size);
                  if (newArray.length > 0)
                    params.set("size", newArray.join(","));
                  else params.delete("size");
                } else {
                  arrayValue.push(size);
                  params.set("size", arrayValue.join(","));
                }
                setSearchParams(params);
                navigate(`?${params.toString()}`);
              }}
              className={`p-2 border font-oswald text-sm transition-colors ${
                currentFilters.size.includes(size)
                  ? "bg-winterella-red border-winterella-red text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-10">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Colors
        </h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                if (params.get("color") === color) {
                  params.delete("color");
                } else {
                  params.set("color", color);
                }
                setSearchParams(params);
                navigate(`?${params.toString()}`);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${
                currentFilters.color === color
                  ? "bg-white text-black border-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-gray-600"
                style={{ backgroundColor: color.toLowerCase() }}
              />
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Filter */}
      <div className="mb-10">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Material
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {materials.map((material) => (
            <button
              key={material}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                const currentValue = params.get("material");
                const arrayValue = currentValue ? currentValue.split(",") : [];
                if (arrayValue.includes(material)) {
                  const newArray = arrayValue.filter((m) => m !== material);
                  if (newArray.length > 0)
                    params.set("material", newArray.join(","));
                  else params.delete("material");
                } else {
                  arrayValue.push(material);
                  params.set("material", arrayValue.join(","));
                }
                setSearchParams(params);
                navigate(`?${params.toString()}`);
              }}
              className={`p-2 border font-oswald text-sm transition-colors ${
                currentFilters.material.includes(material)
                  ? "bg-winterella-red border-winterella-red text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="mb-10">
        <h3 className="text-3xl font-oswald uppercase mb-6 tracking-tighter">
          Brand
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                const currentValue = params.get("brand");
                const arrayValue = currentValue ? currentValue.split(",") : [];
                if (arrayValue.includes(brand)) {
                  const newArray = arrayValue.filter((b) => b !== brand);
                  if (newArray.length > 0) params.set("brand", newArray.join(","));
                  else params.delete("brand");
                } else {
                  arrayValue.push(brand);
                  params.set("brand", arrayValue.join(","));
                }
                setSearchParams(params);
                navigate(`?${params.toString()}`);
              }}
              className={`p-2 border font-oswald text-sm transition-colors ${
                currentFilters.brand.includes(brand)
                  ? "bg-winterella-red border-winterella-red text-white"
                  : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
