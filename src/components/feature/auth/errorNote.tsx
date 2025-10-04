import { AlertCircleIcon  } from "lucide-react";

interface ErrorNoteProps {
  message: string;
}

export const ErrorNote = ({ message }: ErrorNoteProps) => {
  return (
    <div className="flex items-center gap-2 text-red-500 mt-2">
      <AlertCircleIcon className="size-5" />
      <span>{message}</span>
    </div>
  );
};