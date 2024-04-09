"use client";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="flex gap-1">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Submit
    </Button>
  );
};
