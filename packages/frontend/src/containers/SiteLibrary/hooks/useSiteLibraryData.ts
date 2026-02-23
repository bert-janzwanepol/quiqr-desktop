import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import service from '../../../services/service';
import { configQueryOptions } from '../../../queries/options';
import { useInvalidateConfigurations } from '../../../queries/hooks';
import * as api from '../../../api';

export function useSiteLibraryData() {
  const [sitesListingView, setSitesListingView] = useState('');
  const invalidate = useInvalidateConfigurations();

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

  return {
    configurations,
    quiqrCommunityTemplates,
    sitesListingView,
    error: isError ? String(error) : communityError ? (communityError as Error).message : null,
    invalidate,
  };
}
