import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import service from '../../../services/service';
import { configQueryOptions } from '../../../queries/options';
import * as api from '../../../api';

export function useSiteLibraryData() {
  const queryClient = useQueryClient();
  const [sitesListingView, setSitesListingView] = useState('');

  const { data: configurations = { sites: [] }, isError, error } = useQuery(configQueryOptions.all());

  const { data: quiqrCommunityTemplates = [], error: communityError } = useQuery({
    queryKey: ['communityTemplates'] as const,
    queryFn: () => api.updateCommunityTemplates(),
    staleTime: 10 * 60 * 1000, // 10 minutes - remote template list is slow to change
  });

  useEffect(() => {
    service.api.stopHugoServer();
    service.api.readConfPrefKey('sitesListingView').then((view) => {
      if (typeof view === 'string') {
        setSitesListingView(view);
      }
    });
  }, []);

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['getConfigurations'] });
  }, [queryClient]);

  return {
    configurations,
    quiqrCommunityTemplates,
    sitesListingView,
    error: isError ? String(error) : communityError ? (communityError as Error).message : null,
    invalidate,
  };
}
