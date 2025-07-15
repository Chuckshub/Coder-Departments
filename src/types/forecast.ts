export interface VendorItem {
  id: number;
  source: 'tooling' | 'ps' | 'sm';
  vendor: string;
  properAccount: string;
  department: string;
  subdepartment: string;
}

export interface DepartmentGroup {
  department: string;
  items: VendorItem[];
  count: number;
}

export type SourceType = 'tooling' | 'ps' | 'sm';

export interface FilterState {
  search: string;
  department: string;
  account: string;
  subdepartment: string;
}

export interface SortConfig {
  key: keyof VendorItem;
  direction: 'asc' | 'desc';
}
