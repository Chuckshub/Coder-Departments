import { ForecastItem, DepartmentSubtotal, MonthlyData } from '@/types/forecast';

/**
 * Format currency values to USD locale string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get unique values from an array of objects for a specific key
 */
export function getUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
  const values = items.map(item => item[key]);
  return Array.from(new Set(values)).filter(Boolean);
}

/**
 * Filter forecast items based on search and filter criteria
 */
export function filterForecastItems(
  items: ForecastItem[],
  search: string,
  department: string,
  account: string,
  subdepartment: string
): ForecastItem[] {
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
 * Sort forecast items based on key and direction
 */
export function sortForecastItems(
  items: ForecastItem[],
  key: keyof ForecastItem | 'fyTotal',
  direction: 'asc' | 'desc'
): ForecastItem[] {
  return [...items].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    if (key === 'fyTotal') {
      aValue = a.fyTotal;
      bValue = b.fyTotal;
    } else {
      aValue = a[key];
      bValue = b[key];
    }
    
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
 * Group forecast items by department and calculate subtotals
 */
export function groupByDepartment(items: ForecastItem[]): DepartmentSubtotal[] {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = [];
    }
    acc[item.department].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);
  
  return Object.entries(grouped).map(([department, departmentItems]) => {
    const total = departmentItems.reduce((sum, item) => sum + item.fyTotal, 0);
    
    // Calculate monthly totals for the department
    const monthlyTotals: MonthlyData = {};
    departmentItems.forEach(item => {
      Object.entries(item.monthly).forEach(([month, amount]) => {
        monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
      });
    });
    
    return {
      department,
      items: departmentItems,
      total,
      monthlyTotals
    };
  }).sort((a, b) => b.total - a.total); // Sort by total descending
}

/**
 * Get all month keys from the data in chronological order
 */
export function getMonthKeys(items: ForecastItem[]): string[] {
  const monthSet = new Set<string>();
  items.forEach(item => {
    Object.keys(item.monthly).forEach(month => monthSet.add(month));
  });
  
  return Array.from(monthSet).sort();
}

/**
 * Get month display name from YYYY-MM format
 */
export function getMonthDisplayName(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
