import { useQuery } from '@tanstack/react-query';
import { institutionService } from '@/api/services/institution.service';
import { institutionKeys } from '@/api/keys/institution.keys';

export const useInstitutionStats = () =>
  useQuery({
    queryKey: institutionKeys.stats(),
    queryFn: () => institutionService.getStats(),
  });
