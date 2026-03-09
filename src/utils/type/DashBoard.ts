export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardDataState {
  statusData: ChartData[];
  transporteData: ChartData[];
  viagensMensaisData: ChartData[];
  comprasMensaisData: ChartData[];
  loading: boolean;
  error: string | null;
}
