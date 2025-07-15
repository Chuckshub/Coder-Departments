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
import { ForecastItem, FilterState, SortConfig, SourceType } from "@/types/forecast";
import {
  filterForecastItems,
  sortForecastItems,
  getUniqueValues,
  groupByDepartment
} from "@/lib/utils";
import { ForecastTable } from "@/components/tables/ForecastTable";
import { DepartmentGroupView } from "@/components/tables/DepartmentGroupView";

export default function Home() {
  const [data, setData] = useState<ForecastItem[]>([]);
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
    key: "fyTotal",
    direction: "desc"
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/forecast.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error loading forecast data:', error);
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
    let filtered = filterForecastItems(
      tabData,
      filters.search,
      filters.department,
      filters.account,
      filters.subdepartment
    );
    
    return sortForecastItems(filtered, sortConfig.key, sortConfig.direction);
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

  const handleSort = (key: keyof ForecastItem | 'fyTotal') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const getTabLabel = (source: SourceType) => {
    switch (source) {
      case 'tooling': return 'Tooling';
      case 'ps': return 'Professional Services';
      case 'sm': return 'Sales & Marketing';
      default: return source;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          FP&A Department Forecast Tool
        </h1>
        <p className="text-gray-600">
          Vendor and account forecasting for AP teams
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              placeholder="Search vendors, accounts, departments..."
              value={filters.search}
              onValueChange={(value) => handleFilterChange('search', value)}
              startContent={<SearchIcon className="text-gray-400" />}
              className="flex-1"
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
              >
                {uniqueDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
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
              >
                {uniqueAccounts.map((account) => (
                  <SelectItem key={account} value={account}>
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
              >
                {uniqueSubdepartments.map((subdept) => (
                  <SelectItem key={subdept} value={subdept}>
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
            >
              Group by Department
            </Switch>
            
            <div className="text-sm text-gray-600">
              {filteredData.length} items found
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as SourceType)}
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab key="tooling" title={getTabLabel("tooling")} />
          <Tab key="ps" title={getTabLabel("ps")} />
          <Tab key="sm" title={getTabLabel("sm")} />
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
          <ForecastTable
            data={filteredData}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        )}
      </div>
    </div>
  );
}
