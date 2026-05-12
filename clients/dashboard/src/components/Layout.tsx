import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Menu, MenuItem, Collapse } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import StoreIcon from '@mui/icons-material/Store';
import ImageIcon from '@mui/icons-material/Image';
import MapIcon from '@mui/icons-material/Map';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactsIcon from '@mui/icons-material/Contacts';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAuth } from '../contexts/AuthContext';

// ─── Nav Config ───────────────────────────────────────────────────────────────

type NavLeaf  = { label: string; path: string; icon: React.ReactNode };
type NavGroup = { label: string; icon: React.ReactNode; children: NavLeaf[] };
type NavItem  = NavLeaf | NavGroup;

const isGroup = (item: NavItem): item is NavGroup => 'children' in item;

const getNavItems = (roles: string[]): NavItem[] => {
  const items: NavItem[] = [];

  if (roles.includes('Admin')) {
    items.push({
      label: 'Users',
      icon: <PeopleIcon fontSize="small" />,
      children: [
        { label: 'Users',          path: '/users',          icon: <PeopleIcon fontSize="small" /> },
        { label: 'User Companies', path: '/user-companies', icon: <BusinessIcon fontSize="small" /> },
      ],
    });
  }

  if (roles.includes('Admin') || roles.includes('Employee')) {
    items.push({
      label: 'CMS Content',
      icon: <ArticleIcon fontSize="small" />,
      children: [
        { label: 'Ads',          path: '/ads',          icon: <ImageIcon fontSize="small" /> },
        { label: 'Clients', path: '/clients', icon: <StoreIcon fontSize="small" /> },
        { label: 'Hot Topics', path: '/hot-topics', icon: <ArticleIcon fontSize="small" /> },
      ],
    });
  }

  if (roles.includes('Admin') || roles.includes('Employee')) {
    items.push({
      label: 'Gulf Data',
      icon: <ArticleIcon fontSize="small" />,
      children: [
        { label: 'Areas',        path: '/areas',        icon: <MapIcon fontSize="small" /> },
        { label: 'BP Companies', path: '/bp-companies', icon: <ApartmentIcon fontSize="small" /> },
        { label: 'BP Contacts',  path: '/bp-contacts',  icon: <ContactsIcon fontSize="small" /> },
      ],
    });
  }

  return items;
};

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

const DropdownNavItem = ({ item, currentPath }: { item: NavGroup; currentPath: string }) => {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchor);
  const isActive = item.children.some(c => currentPath.startsWith(c.path));

  return (
    <>
      <button
        onClick={e => setAnchor(e.currentTarget)}
        className={[
          'flex items-center gap-1 px-3 h-full text-sm transition-all border-b-2',
          isActive
            ? 'font-semibold border-white'
            : 'font-normal border-transparent hover:border-white/60',
        ].join(' ')}
      >
        {item.label}
        <KeyboardArrowDownIcon
          fontSize="small"
          style={{
            transition: 'transform 200ms',
            transform: open ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        slotProps={{ paper: { elevation: 3, sx: { mt: 0.5, minWidth: 200 } } }}
      >
        {item.children.map(child => (
          <MenuItem
            key={child.path}
            selected={currentPath.startsWith(child.path)}
            onClick={() => { navigate(child.path); setAnchor(null); }}
            sx={{ gap: 1.5 }}
          >
            {child.icon}
            {child.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// ─── Desktop Direct Link ──────────────────────────────────────────────────────

const DirectNavItem = ({ item, currentPath }: { item: NavLeaf; currentPath: string }) => {
  const navigate = useNavigate();
  const isActive = currentPath.startsWith(item.path);

  return (
    <button
      onClick={() => navigate(item.path)}
      className={[
        'flex items-center px-3 h-full text-sm transition-all border-b-2',
        isActive
          ? 'font-semibold border-white'
          : 'font-normal border-transparent hover:border-white/60',
      ].join(' ')}
    >
      {item.label}
    </button>
  );
};

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

const MobileDrawer = ({
  open,
  onClose,
  navItems,
  currentPath,
}: {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentPath: string;
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleLeafClick = (path: string) => { navigate(path); onClose(); };

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          'fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl',
          'transform transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex items-center h-16 px-5 border-b border-neutral-200">
          <span className="text-base font-semibold text-neutral-800 tracking-tight">OCS BBS</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col py-2">
          {navItems.map(item => {
            if (isGroup(item)) {
              const groupExpanded = expanded === item.label;
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setExpanded(groupExpanded ? null : item.label)}
                    className="flex items-center w-full px-4 py-2.5 gap-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-neutral-500">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      style={{
                        transition: 'transform 200ms',
                        transform: groupExpanded ? 'rotate(180deg)' : 'none',
                        color: '#9ca3af',
                      }}
                    />
                  </button>
                  <Collapse in={groupExpanded} unmountOnExit>
                    {item.children.map(child => {
                      const active = currentPath.startsWith(child.path);
                      return (
                        <button
                          key={child.path}
                          onClick={() => handleLeafClick(child.path)}
                          className={[
                            'flex items-center w-full pl-10 pr-4 py-2.5 gap-3 text-sm transition-colors',
                            active
                              ? 'bg-neutral-100 text-neutral-900 font-medium'
                              : 'text-neutral-600 hover:bg-neutral-50',
                          ].join(' ')}
                        >
                          <span className="text-neutral-400">{child.icon}</span>
                          {child.label}
                        </button>
                      );
                    })}
                  </Collapse>
                </div>
              );
            }

            const active = currentPath.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleLeafClick(item.path)}
                className={[
                  'flex items-center w-full px-4 py-2.5 gap-3 text-sm transition-colors',
                  active
                    ? 'bg-neutral-100 text-neutral-900 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100',
                ].join(' ')}
              >
                <span className="text-neutral-500">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location  = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState<null | HTMLElement>(null);
  const [scrolled,     setScrolled]     = useState(false);

  const navItems = getNavItems(user?.roles ?? []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Top navbar ── */}
      <header
        className={[
          'fixed top-0 inset-x-0 z-30 h-16 flex items-center',
          'bg-neutral-800 text-white',
          'transition-shadow duration-200',
          scrolled ? 'shadow-lg' : 'shadow-sm',
        ].join(' ')}
      >
        <div className="flex items-center w-full px-4 gap-2 h-full">

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-1.5 rounded hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand */}
          <span className="text-base font-semibold tracking-tight mr-4">OCS BBS</span>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-stretch flex-1 h-full">
            {navItems.map(item =>
              isGroup(item)
                ? <DropdownNavItem key={item.label} item={item} currentPath={location.pathname} />
                : <DirectNavItem  key={item.path}  item={item} currentPath={location.pathname} />
            )}
          </nav>

          {/* Spacer on mobile */}
          <div className="flex-1 sm:flex-none" />

          {/* User name */}
          <span className="hidden sm:block text-sm text-neutral-300 mr-2">
            {user?.firstName} {user?.lastName}
          </span>

          {/* Avatar */}
          <Avatar
            sx={{ cursor: 'pointer', bgcolor: 'neutral', width: 34, height: 34, fontSize: 14 }}
            onClick={e => setAvatarAnchor(e.currentTarget)}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Menu
            anchorEl={avatarAnchor}
            open={Boolean(avatarAnchor)}
            onClose={() => setAvatarAnchor(null)}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>

        </div>
      </header>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        currentPath={location.pathname}
      />

      {/* Page content */}
      <main className="flex-1 mt-6 p-6">
        {children}
      </main>

    </div>
  );
};

export default Layout;