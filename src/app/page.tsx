"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
  Switch,
  Card,
  CardBody,
  Skeleton
} from "@nextui-org/react";
import { SearchIcon } from "@nextui-org/shared-icons";
import { VendorItem, FilterState, SortConfig, SourceType } from "@/types/forecast";
import {
  filterVendorItems,
  sortVendorItems,
  getUniqueValues,
  groupByDepartment
} from "@/lib/utils";
import { VendorTable } from "@/components/tables/VendorTable";
import { DepartmentGroupView } from "@/components/tables/DepartmentGroupView";

export default function Home() {
  const [data, setData] = useState<VendorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SourceType>("tooling");
  const [groupByDept, setGroupByDept] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: "",
    account: "",
    subdepartment: ""
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "vendor",
    direction: "asc"
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/vendors.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter data by active tab
  const tabData = useMemo(() => {
    return data.filter(item => item.source === activeTab);
  }, [data, activeTab]);

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    let filtered = filterVendorItems(
      tabData,
      filters.search,
      filters.department,
      filters.account,
      filters.subdepartment
    );
    
    return sortVendorItems(filtered, sortConfig.key, sortConfig.direction);
  }, [tabData, filters, sortConfig]);

  // Get unique values for filter dropdowns
  const uniqueDepartments = useMemo(() => getUniqueValues(tabData, 'department'), [tabData]);
  const uniqueAccounts = useMemo(() => getUniqueValues(tabData, 'properAccount'), [tabData]);
  const uniqueSubdepartments = useMemo(() => getUniqueValues(tabData, 'subdepartment'), [tabData]);

  // Group data by department if enabled
  const groupedData = useMemo(() => {
    return groupByDepartment(filteredData);
  }, [filteredData]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (key: keyof VendorItem) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getTabLabel = (source: SourceType) => {
    switch (source) {
      case 'tooling': return 'SaaS & Software';
      case 'ps': return 'Professional Services';
      case 'sm': return 'Sales & Marketing';
      default: return source;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 bg-white min-h-screen">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-black">
            Vendor Department Lookup Tool
          </h1>
          <p className="text-black">
            Find the correct department and account code for any vendor
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white border border-gray-200">
          <CardBody className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <Input
                placeholder="Search vendors, accounts, departments..."
                value={filters.search}
                onValueChange={(value) => handleFilterChange('search', value)}
                startContent={<SearchIcon className="text-black" />}
                className="flex-1"
                classNames={{
                  input: "text-black",
                  inputWrapper: "bg-white border border-gray-300"
                }}
                isClearable
              />
              
              <div className="flex gap-2">
                <Select
                  placeholder="Department"
                  selectedKeys={filters.department ? [filters.department] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string || '';
                    handleFilterChange('department', value);
                  }}
                  className="w-48"
                  classNames={{
                    trigger: "bg-white border border-gray-300 text-black",
                    value: "text-black"
                  }}
                >
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-black">
                      {dept}
                    </SelectItem>
                  ))}
                </Select>
                
                <Select
                  placeholder="Account"
                  selectedKeys={filters.account ? [filters.account] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string || '';
                    handleFilterChange('account', value);
                  }}
                  className="w-64"
                  classNames={{
                    trigger: "bg-white border border-gray-300 text-black",
                    value: "text-black"
                  }}
                >
                  {uniqueAccounts.map((account) => (
                    <SelectItem key={account} value={account} className="text-black">
                      {account}
                    </SelectItem>
                  ))}
                </Select>
                
                <Select
                  placeholder="Subdepartment"
                  selectedKeys={filters.subdepartment ? [filters.subdepartment] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string || '';
                    handleFilterChange('subdepartment', value);
                  }}
                  className="w-48"
                  classNames={{
                    trigger: "bg-white border border-gray-300 text-black",
                    value: "text-black"
                  }}
                >
                  {uniqueSubdepartments.map((subdept) => (
                    <SelectItem key={subdept} value={subdept} className="text-black">
                      {subdept}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Switch
                isSelected={groupByDept}
                onValueChange={setGroupByDept}
                size="sm"
                classNames={{
                  label: "text-black"
                }}
              >
                <span className="text-black">Group by Department</span>
              </Switch>
              
              <div className="text-sm text-black">
                {filteredData.length} vendors found
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-2">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as SourceType)}
            variant="underlined"
            classNames={{
              tabList: "gap-6 w-full relative rounded-none p-0",
              cursor: "w-full bg-blue-600",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-blue-600 text-black"
            }}
          >
            <Tab key="tooling" title={<span className="text-black">{getTabLabel("tooling")}</span>} />
            <Tab key="ps" title={<span className="text-black">{getTabLabel("ps")}</span>} />
            <Tab key="sm" title={<span className="text-black">{getTabLabel("sm")}</span>} />
          </Tabs>
        </div>

        {/* Table Content */}
        <div className="space-y-6">
          {groupByDept ? (
            <DepartmentGroupView
              groupedData={groupedData}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          ) : (
            <VendorTable
              data={filteredData}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          )}
        </div>
      </div>
    </div>
  );
}
