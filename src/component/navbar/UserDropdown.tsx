import { Dropdown } from 'flowbite-react';
import PlaceholderAvatar from '../@share/PlaceholderAvatar';
import { isEmpty } from 'lodash';
import { useSelector } from '../../redux';
import trimAddress from '../../helper/trim-address';

export default function UserDropdown() {
  const { user } = useSelector(state => state.account);

  if (isEmpty(user)) {
    return <></>;
  }
  return (
    <>
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <span className="ml-3 mr-2">
            <span className="sr-only">User menu</span>
            <PlaceholderAvatar publicAddress={user.publicAddress} />
          </span>
        }>
        <Dropdown.Header>
          <div className="cursor-pointer mr-5">
            <span className="block text-sm">Neil Sims</span>
            <span className="block truncate text-sm font-medium">
              {trimAddress(user.publicAddress)}
            </span>
          </div>
        </Dropdown.Header>
        <Dropdown.Item>Dashboard</Dropdown.Item>
        <Dropdown.Item>Settings</Dropdown.Item>
        <Dropdown.Item>Earnings</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item>Sign out</Dropdown.Item>
      </Dropdown>
    </>
  );
}
