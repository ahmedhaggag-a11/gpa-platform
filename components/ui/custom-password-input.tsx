import React, { forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  id: string;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  error?: string;
}

const CustomPasswordInput = forwardRef<HTMLInputElement, CustomPasswordInputProps>(
  ({ label, placeholder, id, showPassword, setShowPassword, error, className, ...rest }, ref) => {
    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="md:text-lg">
          {label}
        </Label>
        <div className="relative">
          <Lock className="absolute end-4 top-4 h-5 w-5 text-muted-foreground" />
          <Input
            ref={ref}
            id={id}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={cn("pe-12 h-12 md:text-lg", error && "border-red-500", className)}
            {...rest}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute start-4 top-4 h-5 w-5 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="md:text-sm text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

CustomPasswordInput.displayName = "CustomPasswordInput";

export default CustomPasswordInput;