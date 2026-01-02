import { colorSchemes } from "../assets/assets";

const ColorSchemeSelector = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-200">
        Color Scheme
      </label>
      <div className="grid grid-cols-6 gap-3">
        {colorSchemes.map((schema) => (
          <button
            key={schema.id}
            title={schema.name}
            className={`relative rounded-lg transition-all ${
              value === schema.id && "ring-2 ring-pink-500"
            }`}
            onClick={() => onChange(schema.id)}
          >
            <div className="flex h-10 rounded-lg overflow-hidden">
              {schema.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Selected: {colorSchemes.find((schema) => schema.id === value)?.name}
      </p>
    </div>
  );
};

export default ColorSchemeSelector;
