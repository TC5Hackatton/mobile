export interface ResponseTaskDTO {
  id: string;
  title: string;
  description: string;
  timeType: string;
  timeValue?: number;
  timeSpend: number;
  status: string;
  uid: string;
}
