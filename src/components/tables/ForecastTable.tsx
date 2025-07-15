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
      return <ChevronUpIcon className="w-4 h-4 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="w-4 h-4" /> : 
      <ChevronDownIcon className="w-4 h-4" />;
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
      className="h-auto p-0 min-w-0 justify-start font-semibold"
      onClick={() => onSort(sortKey)}
      endContent={getSortIcon(sortKey)}
    >
      {children}
    </Button>
  );

  const getContractStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (now < startDate) {
      return <Chip size="sm" color="warning" variant="flat">Upcoming</Chip>;
    } else if (now > endDate) {
      return <Chip size="sm" color="default" variant="flat">Expired</Chip>;
    } else {
      return <Chip size="sm" color="success" variant="flat">Active</Chip>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table 
        aria-label="Forecast data table"
        classNames={{
          wrapper: "min-h-[400px]",
          th: "bg-gray-50 text-gray-700 font-semibold",
          td: "py-3"
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
            Contract Status
          </TableColumn>
          {monthKeys.map(month => (
            <TableColumn key={month} className="min-w-[100px] text-right">
              {getMonthDisplayName(month)}
            </TableColumn>
          ))}
          <TableColumn key="fyTotal" className="min-w-[120px] text-right">
            <SortableHeader sortKey="fyTotal">FY Total</SortableHeader>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No data found">
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.vendor}</TableCell>
              <TableCell className="text-sm">{item.properAccount}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="primary">
                  {item.department}
                </Chip>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {item.subdepartment}
              </TableCell>
              <TableCell>
                {getContractStatus(item.contractStart, item.contractEnd)}
              </TableCell>
              {monthKeys.map(month => (
                <TableCell key={month} className="text-right font-mono text-sm">
                  {item.monthly[month] ? formatCurrency(item.monthly[month]) : '-'}
                </TableCell>
              ))}
              <TableCell className="text-right font-semibold">
                {formatCurrency(item.fyTotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
