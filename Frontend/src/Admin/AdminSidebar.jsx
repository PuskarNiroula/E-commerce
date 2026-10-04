
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const menuItems = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: 'dashboard',
  },
  {
    title: 'Products',
    icon: 'products',
    children: [
      { title: 'Categories', path: '/admin/products/categories' },
      { title: 'Brands', path: '/admin/products/brands' },
      { title: 'Products', path: '/admin/products' },
      { title: 'Reviews', path: '/admin/products/reviews' },
    ],
  },
  {
    title: 'Orders',
    icon: 'orders',
    children: [
      { title: 'New Orders', path: '/admin/orders/new' },
      { title: 'Pending', path: '/admin/orders/pending' },
      { title: 'Processing', path: '/admin/orders/processing' },
      { title: 'Completed', path: '/admin/orders/completed' },
      { title: 'Cancelled', path: '/admin/orders/cancelled' },
      { title: 'Returns', path: '/admin/orders/returns' },
    ],
  },
  {
    title: 'Transactions',
    icon: 'transactions',
    children: [
      { title: 'Payments', path: '/admin/transactions/payments' },
      { title: 'Pending', path: '/admin/transactions/pending' },
      { title: 'Completed', path: '/admin/transactions/completed' },
      { title: 'Refunds', path: '/admin/transactions/refunds' },
      { title: 'Transaction History', path: '/admin/transactions/history' },
    ],
  },
  {
    title: 'Customers',
    icon: 'customers',
    children: [
      { title: 'Customers', path: '/admin/customers' },
    ],
  },
  {
    title: 'Subscription',
    icon: 'subscription',
    children: [
      { title: 'Current Plan', path: '/admin/subscription/current' },
      { title: 'Extend / Renew', path: '/admin/subscription/renew' },
      { title: 'Payment History', path: '/admin/subscription/payments' },
    ],
  },
  {
    title: 'Reports',
    icon: 'reports',
    children: [
      { title: 'Sales', path: '/admin/reports/sales' },
      { title: 'Orders', path: '/admin/reports/orders' },
      { title: 'Products', path: '/admin/reports/products' },
      { title: 'Customers', path: '/admin/reports/customers' },
    ],
  },
  {
    title: 'Settings',
    icon: 'settings',
    children: [
      { title: 'Store', path: '/admin/settings/store' },
      { title: 'Email', path: '/admin/settings/email' },
      { title: 'Password', path: '/admin/settings/password' },
      { title: 'Payment', path: '/admin/settings/payment' },
      { title: 'Shipping', path: '/admin/settings/shipping' },
      { title: 'Notifications', path: '/admin/settings/notifications' },
    ],
  },
]

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  products: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8.5 12 4 3 8.5v7L12 20l9-4.5z" />
      <path d="M3 8.5 12 13l9-4.5" />
      <path d="M12 13v7" />
    </svg>
  ),

  orders: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 2h12v20H6z" />
      <path d="M9 6h6M9 10h6M9 14h4" />
    </svg>
  ),

  transactions: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18" />
      <path d="M7 15h3" />
    </svg>
  ),

  customers: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7" />
    </svg>
  ),

  subscription: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v6h-6" />
      <path d="M12 8v4l3 2" />
    </svg>
  ),

  reports: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5M4 19h17" />
      <path d="m7 15 4-4 3 2 5-6" />
    </svg>
  ),

  settings: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.2a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A2 2 0 0 0 1.7 11H1.5a2 2 0 0 1 0-4h.2a2 2 0 0 0 1.4-3.4L3 3.5A2 2 0 0 1 5.8.7l.1.1A2 2 0 0 0 9.3-.6V-.8a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.4l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1A2 2 0 0 0 20.9 7h.2a2 2 0 0 1 0 4h-.2a2 2 0 0 0-1.5 4Z" />
    </svg>
  ),
}

function Sidebar() {
  const location = useLocation()

  const getInitialOpenState = () => {
    const state = {}

    menuItems.forEach((item) => {
      if (item.children) {
        state[item.title] = item.children.some((child) =>
          location.pathname === child.path ||
          location.pathname.startsWith(`${child.path}/`)
)
}
})

return state
}

const [openMenus, setOpenMenus] = useState(getInitialOpenState)

const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
        ...prev,
        [title]: !prev[title],
    }))
}

const isParentActive = (item) => {
    if (!item.children) return false

    return item.children.some(
        (child) =>
            location.pathname === child.path ||
            location.pathname.startsWith(`${child.path}/`)
    )
}

return (
    <aside className="admin-sidebar">

        <div className="sidebar-brand">
            <div className="sidebar-brand-mark">
                E
            </div>

            <div className="sidebar-brand-text">
                <span>E-commerce</span>
                <small>Administration</small>
            </div>
        </div>

        <div className="sidebar-section-label">
            MENU
        </div>

        <nav className="sidebar-nav">

            {menuItems.map((item) => (
                <div
                    key={item.title}
                    className={`sidebar-group ${
                        isParentActive(item) ? 'parent-active' : ''
                    }`}
                >

                    {item.children ? (
                        <>
                            <button
                                type="button"
                                className="sidebar-menu-button"
                                onClick={() => toggleMenu(item.title)}
                                aria-expanded={openMenus[item.title]}
                            >
                  <span className="sidebar-menu-left">

                    <span className="sidebar-icon">
                      {icons[item.icon]}
                    </span>

                    <span className="sidebar-menu-title">
                      {item.title}
                    </span>

                  </span>

                                <span
                                    className={`sidebar-chevron ${
                                        openMenus[item.title] ? 'open' : ''
                                    }`}
                                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                            </button>

                            <div
                                className={`sidebar-submenu-wrapper ${
                                    openMenus[item.title] ? 'open' : ''
                                }`}
                            >
                                <div className="sidebar-submenu">

                                    {item.children.map((child) => (
                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            className={({ isActive }) =>
                                                `sidebar-submenu-link ${
                                                    isActive ? 'active' : ''
                                                }`
                                            }
                                        >
                                            <span className="submenu-indicator" />
                                            <span>{child.title}</span>
                                        </NavLink>
                                    ))}

                                </div>
                            </div>
                        </>
                    ) : (
                        <NavLink
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `sidebar-menu-link ${
                                    isActive ? 'active' : ''
                                }`
                            }
                        >
                <span className="sidebar-menu-left">

                  <span className="sidebar-icon">
                    {icons[item.icon]}
                  </span>

                  <span className="sidebar-menu-title">
                    {item.title}
                  </span>

                </span>
                        </NavLink>
                    )}

                </div>
            ))}

        </nav>

        <div className="sidebar-footer">

            <div className="sidebar-footer-card">

                <div className="sidebar-footer-avatar">
                    A
                </div>

                <div className="sidebar-footer-info">
                    <strong>Administrator</strong>
                    <span>Admin Account</span>
                </div>

                <button
                    type="button"
                    className="sidebar-footer-more"
                    aria-label="Account options"
                >
                    <span />
                    <span />
                    <span />
                </button>

            </div>

        </div>

    </aside>
)
}

export default Sidebar

