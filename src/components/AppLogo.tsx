import { Leaf } from "lucide-react";

const AppLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeMap = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };
  const textMap = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} rounded-xl gradient-hero flex items-center justify-center`}>
        <Leaf className="text-primary-foreground" size={size === "sm" ? 18 : size === "md" ? 26 : 34} />
      </div>
      <div>
        <h1 className={`${textMap[size]} font-heading font-bold text-primary leading-tight`}>Suraksha Setu</h1>
        {size !== "sm" && (
          <p className="text-xs text-muted-foreground tracking-wide">Bridging Ayurveda & Modern Medicine</p>
        )}
      </div>
    </div>
  );
};

export default AppLogo;
