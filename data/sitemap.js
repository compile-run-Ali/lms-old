import DashboardSVG from '../svgs/dashboard'
import MarketplaceSVG from '../svgs/marketplace'
import MenuSidebarSVG from '../svgs/menu_sidebar'
import UserProfileSVG from '../svgs/user_profile'

export const site_map = [
  {
    id: 1,
    name: 'Dashboard',
    icon: <DashboardSVG className="fill-light-text hover:fill-primary-green" />,
    activeIcon: <DashboardSVG className="fill-primary-green" />,
    active: false,
    extendable: false,
    subItems: [],
    link: '/',
    sublinks: [],
  },
  {
    id: 2,
    name: 'Marketplace',
    icon: <MarketplaceSVG className="fill-light-text hover:fill-primary-green" />,
    activeIcon: <MarketplaceSVG className="fill-primary-green" />,
    active: true,
    extendable: true,
    link: '/',
    subItems: [
      {
        id: 1,
        name: 'Discover',
        link: '/',
      },
      {
        id: 2,
        name: 'Rankings',
        link: '/rankings',
      },
      {
        id: 3,
        name: 'Create',
        link: '/create_nft',
      },
    ],
    sublinks: ['/', '/rankings', '/create_nft'],
  },
  {
    id: 3,
    name: 'User Profile',
    icon: <UserProfileSVG className="fill-light-text hover:fill-primary-green" />,
    activeIcon: <UserProfileSVG className="fill-primary-green" />,
    active: false,
    extendable: true,
    link: '/profile',
    subItems: [
      {
        id: 1,
        name: 'My Profile',
        link: '/profile',
      },
      {
        id: 2,
        name: 'Activites',
        link: '/activities',
      },
      {
        id: 3,
        name: 'Settings',
        link: '/settings',
      },
    ],
    sublinks: ['/profile', '/activities', '/settings'],
  },
  {
    id: 4,
    name: 'More Products',
    icon: <MenuSidebarSVG className="fill-light-text hover:fill-primary-green" />,
    activeIcon: <MenuSidebarSVG className="fill-primary-green" />,
    active: false,
    extendable: true,
    subItems: ['Search', 'Rankings', 'Create'],
    sublinks: [],
  },
]
