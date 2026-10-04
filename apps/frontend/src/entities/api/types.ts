export type TPaginationRequestDTO = {
  page?: number;
  limit?: number;
};

export type TPaginationResponseDTO = {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};
