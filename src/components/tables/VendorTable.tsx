"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip
} from "@nextui-org/react";
import { ChevronUpIcon, ChevronDownIcon } from "@nextui-org/shared-icons";
import { VendorItem, SortConfig } from "@/types/forecast";

interface VendorTableProps {
  data: VendorItem[];
  onSort: (key: keyof VendorItem) => void;
  sortConfig: SortConfig;
}

export function VendorTable({ data, onSort, sortConfig }: VendorTableProps) {
  const getSortIcon = (key: keyof VendorItem) => {
    if (sortConfig.key !== key) {
      return <ChevronUpIcon className="w-4 h-4 opacity-30 text-black" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4 text-black" /> : 
      <ChevronDownIcon className="w-4 h-4 text-black" />;
  };

  const SortableHeader = ({ 
    children, 
    sortKey 
  }: { 
    children: React.ReactNode; 
    sortKey: keyof VendorItem 
  }) => (
    <Button
      variant="light"
      className="h-auto p-0 min-w-0 justify-start font-semibold text-black bg-transparent hover:bg-gray-100"
      onClick={() => onSort(sortKey)}
      endContent={getSortIcon(sortKey)}
    >
      <span className="text-black">{children}</span>
    </Button>
  );

  return (
    <div className="overflow-x-auto bg-white">
      <Table 
        aria-label="Vendor lookup table"
        classNames={{
          wrapper: "min-h-[400px] bg-white",
          th: "bg-gray-50 text-black font-semibold border-b border-gray-200",
          td: "py-3 text-black border-b border-gray-100",
          table: "bg-white"
        }}
        isStriped
      >
        <TableHeader>
          <TableColumn key="vendor" className="min-w-[200px]">
            <SortableHeader sortKey="vendor">Vendor</SortableHeader>
          </TableColumn>
          <TableColumn key="account" className="min-w-[250px]">
            <SortableHeader sortKey="properAccount">Account Code</SortableHeader>
          </TableColumn>
          <TableColumn key="department" className="min-w-[150px]">
            <SortableHeader sortKey="department">Department</SortableHeader>
          </TableColumn>
          <TableColumn key="subdepartment" className="min-w-[180px]">
            <SortableHeader sortKey="subdepartment">Subdepartment</SortableHeader>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={<span className="text-black">No vendors found</span>}>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-black">{item.vendor}</TableCell>
              <TableCell className="text-sm text-black font-mono">{item.properAccount}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="primary" className="text-black">
                  {item.department}
                </Chip>
              </TableCell>
              <TableCell className="text-sm text-black">
                {item.subdepartment}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
