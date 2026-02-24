import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import service from '../../../services/service';
import { configQueryOptions, prefsQueryOptions } from '../../../queries/options';
import { useInvalidateConfigurations } from '../../../queries/hooks';
import * as api from '../../../api';

export function useSiteLibraryData() {
  const invalidate = useInvalidateConfigurations();

  const { data: configurations = { sites: [] }, isError, error } = useQuery(configQueryOptions.all());

  const { data: quiqrCommunityTemplates = [], error: communityError } = useQuery({
    queryKey: ['communityTemplates'] as const,
    queryFn: () => api.updateCommunityTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes - remote template list is slow to change
  });

  // Fetch sitesListingView using unified config API
  const { data: prefs } = useQuery(prefsQueryOptions.all());
  const sitesListingView = (prefs?.sitesListingView as string | undefined) ?? 'cards';

  useEffect(() => {
    service.api.stopHugoServer();
  }, []);

  return {
    configurations,
    quiqrCommunityTemplates,
    sitesListingView,
    error: isError ? String(error) : communityError ? (communityError as Error).message : null,
    invalidate,
  };
}
