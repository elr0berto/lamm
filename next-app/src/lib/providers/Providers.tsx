'use client';

import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { TRPCProvider } from './TRPCProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <FluentProvider theme={webLightTheme}>
        {children}
      </FluentProvider>
    </TRPCProvider>
  );
}