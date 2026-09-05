import React, { forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder: string;
  type: string;
  id: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  error?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, placeholder, type, id, Icon, error, className, ...rest }, ref) => {
    return (
      <div className="space-y-3">
        <Label htmlFor={id} className="md:text-lg">
          {label}
        </Label>
        <div className="relative">
          <Icon className="absolute end-4 top-4 h-5 w-5 text-muted-foreground" />
          <Input
            ref={ref}
            id={id}
            type={type}
            placeholder={placeholder}
            className={cn(
              "pe-12 h-12 md:text-lg",
              error && "border-red-500",
              className
            )}
            {...rest}
          />
        </div>
        {error && <p className="md:text-sm text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
