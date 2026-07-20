import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = ({ to }: { to?: string }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="gap-1.5 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft size={16} />
      Back
    </Button>
  );
};

export default BackButton;
