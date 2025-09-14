export interface StationDTO {
  id: number;
  code: string;
  name: string;
}

export interface CreateStationDto {
  code: string;
  name: string;
}

export interface DeleteStationResponse {
  success: boolean;
}
