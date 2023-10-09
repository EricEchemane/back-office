import { Session } from 'next-auth';
import BreadCrumb from './BreadCrumb';

interface Props {
  session: Session;
}

export default function Topbar({ session: { user } }: Props) {
  user;
  return (
    <header>
      <BreadCrumb />
    </header>
  );
}
