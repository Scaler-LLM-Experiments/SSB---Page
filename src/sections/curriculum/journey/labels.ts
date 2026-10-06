/** Interface copy from the CMS (data.ts `labels`), handed down by the section. */
import * as React from 'react';
import type { Labels } from './data';
import { JOURNEY } from './data';

export const LabelsContext = React.createContext<Labels>(JOURNEY.labels);
export const useLabels = () => React.useContext(LabelsContext);
