"use client";

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  Chip,
  Divider
} from "@nextui-org/react";
import { DepartmentGroup, SortConfig, VendorItem } from "@/types/forecast";
import { VendorTable } from "./VendorTable";

interface DepartmentGroupViewProps {
  groupedData: DepartmentGroup[];
  onSort: (key: keyof VendorItem) => void;
  sortConfig: SortConfig;
}

export function DepartmentGroupView({ 
  groupedData, 
  onSort, 
  sortConfig 
}: DepartmentGroupViewProps) {
  return (
    <div className="space-y-4 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white border border-gray-200">
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {groupedData.length}
            </div>
            <div className="text-sm text-black">Departments</div>
          </CardBody>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {groupedData.reduce((sum, group) => sum + group.count, 0)}
            </div>
            <div className="text-sm text-black">Total Vendors</div>
          </CardBody>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardBody className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(groupedData.flatMap(group => group.items.map(item => item.properAccount))).size}
            </div>
            <div className="text-sm text-black">Unique Accounts</div>
          </CardBody>
        </Card>
      </div>

      {/* Department Groups */}
      <Accordion variant="splitted" selectionMode="multiple" className="bg-white">
        {groupedData.map((group) => (
          <AccordionItem
            key={group.department}
            aria-label={group.department}
            title={
              <div className="flex justify-between items-center w-full pr-4">
                <div className="flex items-center gap-3">
                  <Chip color="primary" variant="flat" className="text-black">
                    {group.department}
                  </Chip>
                  <span className="text-sm text-black">
                    {group.count} vendors
                  </span>
                </div>
              </div>
            }
            className="mb-2 bg-white border border-gray-200"
            classNames={{
              content: "bg-white",
              title: "text-black"
            }}
          >
            <div className="space-y-4 bg-white">
              {/* Account Summary */}
              <Card className="bg-white border border-gray-200">
                <CardBody>
                  <h4 className="font-semibold mb-3 text-black">Account Codes - {group.department}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Array.from(new Set(group.items.map(item => item.properAccount))).map(account => (
                      <div key={account} className="text-sm">
                        <div className="font-mono text-black bg-gray-50 p-2 rounded">
                          {account}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
              
              <Divider className="bg-gray-200" />
              
              {/* Department Items Table */}
              <VendorTable
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
