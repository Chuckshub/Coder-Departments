import { VendorItem, DepartmentGroup } from '@/types/forecast';

/**
 * Get unique values from an array of objects for a specific key
 */
export function getUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
  const values = items.map(item => item[key]);
  return Array.from(new Set(values)).filter(Boolean);
}

/**
 * Filter vendor items based on search and filter criteria
 */
export function filterVendorItems(
  items: VendorItem[],
  search: string,
  department: string,
  account: string,
  subdepartment: string
): VendorItem[] {
  return items.filter(item => {
    const searchMatch = !search || 
      item.vendor.toLowerCase().includes(search.toLowerCase()) ||
      item.properAccount.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.subdepartment.toLowerCase().includes(search.toLowerCase());
    
    const departmentMatch = !department || item.department === department;
    const accountMatch = !account || item.properAccount === account;
    const subdepartmentMatch = !subdepartment || item.subdepartment === subdepartment;
    
    return searchMatch && departmentMatch && accountMatch && subdepartmentMatch;
  });
}

/**
 * Sort vendor items based on key and direction
 */
export function sortVendorItems(
  items: VendorItem[],
  key: keyof VendorItem,
  direction: 'asc' | 'desc'
): VendorItem[] {
  return [...items].sort((a, b) => {
    let aValue: any = a[key];
    let bValue: any = b[key];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Group vendor items by department
 */
export function groupByDepartment(items: VendorItem[]): DepartmentGroup[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = [];
    }
    acc[item.department].push(item);
    return acc;
  }, {} as Record<string, VendorItem[]>);
  
  return Object.entries(grouped).map(([department, departmentItems]) => {
    return {
      department,
      items: departmentItems,
      count: departmentItems.length
    };
  }).sort((a, b) => b.count - a.count); // Sort by count descending
}
