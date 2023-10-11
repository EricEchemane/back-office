import { TableSearchElementsConfig } from '@/components/shared/TableSearch';

export const userSearchConfig: TableSearchElementsConfig = [
  {
    type: 'text',
    name: 'username',
    placeholder: 'Enter username',
    label: 'Username',
  },
  {
    type: 'text',
    name: 'email',
    placeholder: 'Enter email',
    label: 'Email',
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    placeholder: 'Select status',
    options: [
      { label: 'Pending', value: 0 },
      { label: 'Active', value: 1 },
      { label: 'In-active', value: 2 },
      { label: 'Blocked', value: 3 },
    ],
  },
];
