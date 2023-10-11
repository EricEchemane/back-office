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
      { label: 'Pending', value: 1 },
      { label: 'Active', value: 2 },
      { label: 'InActive', value: 3 },
      { label: 'Blocked', value: 4 },
    ],
  },
];
