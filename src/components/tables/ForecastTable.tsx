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
import { ForecastItem, SortConfig } from "@/types/forecast";
import { formatCurrency, getMonthKeys, getMonthDisplayName } from "@/lib/utils";

interface ForecastTableProps {
  data: ForecastItem[];
  onSort: (key: keyof ForecastItem | 'fyTotal') => void;
  sortConfig: SortConfig;
}

export function ForecastTable({ data, onSort, sortConfig }: ForecastTableProps) {
  const monthKeys = getMonthKeys(data);
  
  const getSortIcon = (key: keyof ForecastItem | 'fyTotal') => {
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
    sortKey: keyof ForecastItem | 'fyTotal' 
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

  const getContractStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (now < startDate) {
      return <Chip size="sm" color="warning" variant="flat" className="text-black">Upcoming</Chip>;
    } else if (now > endDate) {
      return <Chip size="sm" color="default" variant="flat" className="text-black">Expired</Chip>;
    } else {
      return <Chip size="sm" color="success" variant="flat" className="text-black">Active</Chip>;
    }
  };

  return (
    <div className="overflow-x-auto bg-white">
      <Table 
        aria-label="Forecast data table"
        classNames={{
          wrapper: "min-h-[400px] bg-white",
          th: "bg-gray-50 text-black font-semibold border-b border-gray-200",
          td: "py-3 text-black border-b border-gray-100",
          table: "bg-white"
        }}
        isStriped
      >
        <TableHeader>
          <TableColumn key="vendor" className="min-w-[150px]">
            <SortableHeader sortKey="vendor">Vendor</SortableHeader>
          </TableColumn>
          <TableColumn key="account" className="min-w-[200px]">
            <SortableHeader sortKey="properAccount">Account</SortableHeader>
          </TableColumn>
          <TableColumn key="department" className="min-w-[120px]">
            <SortableHeader sortKey="department">Department</SortableHeader>
          </TableColumn>
          <TableColumn key="subdepartment" className="min-w-[140px]">
            <SortableHeader sortKey="subdepartment">Subdepartment</SortableHeader>
          </TableColumn>
          <TableColumn key="status" className="min-w-[100px]">
            <span className="text-black font-semibold">Contract Status</span>
          </TableColumn>
          {monthKeys.map(month => (
            <TableColumn key={month} className="min-w-[100px] text-right">
              <span className="text-black font-semibold">{getMonthDisplayName(month)}</span>
            </TableColumn>
          ))}
          <TableColumn key="fyTotal" className="min-w-[120px] text-right">
            <SortableHeader sortKey="fyTotal">FY Total</SortableHeader>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={<span className="text-black">No data found</span>}>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-black">{item.vendor}</TableCell>
              <TableCell className="text-sm text-black">{item.properAccount}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="primary" className="text-black">
                  {item.department}
                </Chip>
              </TableCell>
              <TableCell className="text-sm text-black">
                {item.subdepartment}
              </TableCell>
              <TableCell>
                {getContractStatus(item.contractStart, item.contractEnd)}
              </TableCell>
              {monthKeys.map(month => (
                <TableCell key={month} className="text-right font-mono text-sm text-black">
                  {item.monthly[month] ? formatCurrency(item.monthly[month]) : '-'}
                </TableCell>
              ))}
              <TableCell className="text-right font-semibold text-black">
                {formatCurrency(item.fyTotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
