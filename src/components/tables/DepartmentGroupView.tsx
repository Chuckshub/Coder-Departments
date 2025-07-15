"use client";

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  Chip,
  Divider
} from "@nextui-org/react";
import { DepartmentSubtotal, SortConfig, ForecastItem } from "@/types/forecast";
import { formatCurrency, getMonthKeys, getMonthDisplayName } from "@/lib/utils";
import { ForecastTable } from "./ForecastTable";

interface DepartmentGroupViewProps {
  groupedData: DepartmentSubtotal[];
  onSort: (key: keyof ForecastItem | 'fyTotal') => void;
  sortConfig: SortConfig;
}

export function DepartmentGroupView({ 
  groupedData, 
  onSort, 
  sortConfig 
}: DepartmentGroupViewProps) {
  const allMonthKeys = getMonthKeys(
    groupedData.flatMap(group => group.items)
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-primary">
              {groupedData.length}
            </div>
            <div className="text-sm text-gray-600">Departments</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-success">
              {groupedData.reduce((sum, group) => sum + group.items.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Items</div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-warning">
              {formatCurrency(groupedData.reduce((sum, group) => sum + group.total, 0))}
            </div>
            <div className="text-sm text-gray-600">Grand Total</div>
          </CardBody>
        </Card>
      </div>

      {/* Department Groups */}
      <Accordion variant="splitted" selectionMode="multiple">
        {groupedData.map((group) => (
          <AccordionItem
            key={group.department}
            aria-label={group.department}
            title={
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex items-center gap-3">
                  <Chip color="primary" variant="flat">
                    {group.department}
                  </Chip>
                  <span className="text-sm text-gray-600">
                    {group.items.length} items
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    {formatCurrency(group.total)}
                  </div>
                </div>
              </div>
            }
            className="mb-2"
          >
            <div className="space-y-4">
              {/* Monthly Breakdown */}
              <Card>
                <CardBody>
                  <h4 className="font-semibold mb-3">Monthly Breakdown - {group.department}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {allMonthKeys.map(month => (
                      <div key={month} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {getMonthDisplayName(month)}
                        </div>
                        <div className="font-mono text-sm">
                          {group.monthlyTotals[month] ? 
                            formatCurrency(group.monthlyTotals[month]) : 
                            '-'
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
              
              <Divider />
              
              {/* Department Items Table */}
              <ForecastTable
                data={group.items}
                onSort={onSort}
                sortConfig={sortConfig}
              />
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
