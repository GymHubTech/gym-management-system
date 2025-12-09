import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary', subtitle }) => {
  const colorClasses = {
    primary: 'border-l-primary-500 bg-primary-50',
    success: 'border-l-success-500 bg-success-50',
    warning: 'border-l-warning-500 bg-warning-50',
    danger: 'border-l-danger-500 bg-danger-50',
    accent: 'border-l-accent-500 bg-accent-50',
  };

  const iconBgClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
    accent: 'bg-accent-100 text-accent-600',
  };

  return (
    <div className={`stat-card ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-dark-500">{title}</p>
          <p className="text-2xl font-bold text-dark-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-dark-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {trendValue}
              </span>
              <span className="text-xs text-dark-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
