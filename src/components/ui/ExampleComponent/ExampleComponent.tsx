// Template for modern React components

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

// 1. Props Interface
interface ExampleComponentProps {
  /** Description of what this prop does */
  label: string;
  /** Optional description with default value */
  variant?: 'default' | 'primary' | 'secondary';
  /** Callback when component changes */
  onChange?: (value: string) => void;
  /** Optional className for styling flexibility */
  className?: string;
}

// 2. Default props (if needed)
const defaultProps = {
  variant: 'default' as const
};

// 3. Component Implementation
const ExampleComponent = ({
  label,
  variant = defaultProps.variant,
  onChange,
  className
}: ExampleComponentProps) => {
  // State management
  const [value, setValue] = useState('');

  // Memoized handlers
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  // Computed values/classes
  const componentClasses = cn(
    // Base styles
    'relative flex items-center gap-2 p-4',
    // Variant-specific styles
    {
      'bg-primary text-white': variant === 'primary',
      'bg-secondary text-gray-900': variant === 'secondary',
      'bg-white text-gray-900': variant === 'default'
    },
    // External classes
    className
  );

  return (
    <div className={componentClasses}>
      <span className="font-medium">{label}</span>
      {/* Component content */}
    </div>
  );
};

// 4. Display name for dev tools
ExampleComponent.displayName = 'ExampleComponent';

export default ExampleComponent;

// 5. Type exports (in index.ts)
export type { ExampleComponentProps };