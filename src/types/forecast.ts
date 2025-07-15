export interface MonthlyData {
  [key: string]: number; // Format: "YYYY-MM": amount
}

export interface ForecastItem {
  id: number;
  source: 'tooling' | 'ps' | 'sm';
  vendor: string;
  properAccount: string;
  department: string;
  subdepartment: string;
  contractStart: string;
  contractEnd: string;
  monthly: MonthlyData;
  fyTotal: number;
}

export interface DepartmentSubtotal {
  department: string;
  items: ForecastItem[];
  total: number;
  monthlyTotals: MonthlyData;
}

export type SourceType = 'tooling' | 'ps' | 'sm';

export interface FilterState {
  search: string;
  department: string;
  account: string;
  subdepartment: string;
}

export interface SortConfig {
  key: keyof ForecastItem | 'fyTotal';
  direction: 'asc' | 'desc';
}
