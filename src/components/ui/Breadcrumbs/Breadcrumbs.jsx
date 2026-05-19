import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const Breadcrumbs = ({ items }) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className="sticky z-10 -top-6 w-[calc(100%+3rem)] bg-[#1c213d] border-b border-stroke-divider px-6 py-3 -mx-6 -mt-6 mb-6"
    >
      <ol className="flex items-center text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.label} className="flex items-center">
              {isLast ? (
                <span className="font-semibold text-heading" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.href}
                    className="text-paragraph hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-3 text-paragraph" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
};
