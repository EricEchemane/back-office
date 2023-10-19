import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import React from 'react';

export interface TableActionsProps {
  title?: string;
  items: {
    key: number;
    label: React.ReactNode;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

export default function TableActions({ title, items }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        {items?.map((item) => (
          <DropdownMenuItem
            key={item.key}
            className="flex items-center gap-2"
            onClick={() => item.onClick()}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
