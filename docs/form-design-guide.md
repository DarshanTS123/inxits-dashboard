# Form Design Guide

This document outlines standards and best practices for designing and implementing forms in the inXits Dashboard. All forms must follow these rules unless explicitly documented as an exception.

## Foundational principles

1. **Accessibility first**: Forms must be fully keyboard navigable and screen-reader compatible.
2. **Consistency**: Use shared primitives (`Input`, `Select`, `Button`) for all form controls.
3. **Clear feedback**: Show validation errors inline, not just on submit.
4. **State management**: Use `react-hook-form` for non-trivial forms (more than 2 fields).
5. **Progressive enhancement**: Forms work with JavaScript disabled where sensible.

## Tech stack for forms

- **Form library**: `react-hook-form` (handles state, validation, submission)
- **Input primitives**: `src/components/ui/Input/Input.jsx` for text inputs
- **Select/multi-select**: `src/components/ui/Select/Select.jsx` for dropdowns
- **Buttons**: `src/components/ui/Button/Button.jsx` for submit/reset/cancel
- **Validation**: `react-hook-form` validators + custom patterns
- **Async validation** (if needed): `react-hook-form` `validate` callback with React Query

## Form structure

### Typical layout

```jsx
<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
  {/* Header/section title */}
  <div>
    <h2 className="text-lg font-semibold text-subheading">Section Title</h2>
  </div>

  {/* Form fields */}
  <div className="grid gap-5 md:grid-cols-2">
    <Input {...register('fieldName')} />
  </div>

  {/* Error banner (if form-level) */}
  {error && (
    <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl flex items-center gap-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p>{error}</p>
    </div>
  )}

  {/* Submit buttons */}
  <div className="flex gap-3">
    <Button type="button" variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button type="submit" isLoading={isSubmitting}>
      Submit
    </Button>
  </div>
</form>
```

### Grid layout patterns

Forms should use Tailwind's grid for responsive field layouts:

```jsx
{/* Single column */}
<div className="grid gap-5">
  <Input label="Name" />
</div>

{/* Two columns on desktop, one on mobile */}
<div className="grid gap-5 md:grid-cols-2">
  <Input label="First Name" />
  <Input label="Last Name" />
</div>

{/* Three columns on wide screens */}
<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  <Input label="Field 1" />
  <Input label="Field 2" />
  <Input label="Field 3" />
</div>
```

## Input field patterns

### Standard text input

Use the `Input` component for text, email, password, tel, and number fields:

```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  autoComplete="email"
  {...register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  })}
  error={errors.email?.message}
/>
```

### Input component structure

The `Input` component (`src/components/ui/Input/Input.jsx`) handles:

- **Label**: Rendered above the field with `htmlFor` linking to input id
- **Required indicator**: Red asterisk (`*`) for required fields
- **Placeholder**: Secondary text guidance
- **Error state**: Displays error message below input; sets `aria-invalid`
- **Disabled state**: Dims field and prevents interaction
- **Icon slot** (optional): Icon on left or right side

### Anatomy

```jsx
<Input
  id="field-id"           // Auto-generated from label if omitted
  label="Field Label"     // Optional; see patterns below
  type="text"             // Default; also: email, tel, number, password, etc.
  placeholder="..."       // Optional; secondary guidance
  required               // Optional; shows red asterisk in label
  disabled               // Optional; prevents interaction
  error="Error message"  // Optional; shows error state and message
  icon={<IconComponent />} // Optional; appears in prefix slot
  iconPosition="left"    // or "right"; default is "left"
  {...register('fieldName')} // Spread react-hook-form registration
  className="..."        // Optional; extends classes
/>
```

### Input label patterns

#### Label as a prop (default)

Use the `label` prop when building standalone forms (pages, modals). This automatically renders a labeled `<label>` above the input with required indicator handling:

```jsx
<Input
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  {...register('email', { required: 'Email is required' })}
  error={errors.email?.message}
/>
```

#### Explicit label (drawer forms)

When building forms inside **drawers** or other containers with custom spacing/layout requirements, define the label explicitly using a `<label>` element. **Do NOT pass the `label` prop** in this case:

```jsx
<div className="flex flex-col gap-1.5">
  <label
    htmlFor="client-email"
    className="px-1 text-xs font-medium text-text-label"
  >
    Email ID <span className="text-error">*</span>
  </label>
  <Input
    id="client-email"
    type="email"
    placeholder="Enter email ID"
    {...register('email', {
      required: 'Email ID is required',
      pattern: {
        value: /^\S+@\S+\.\S+$/,
        message: 'Enter a valid email ID',
      },
    })}
    error={errors.email?.message}
  />
</div>
```

**Why explicit labels in drawers?**
- Provides fine-grained control over label styling (font size, color, spacing)
- Allows custom layout with required indicator styling
- Enables consistent spacing (`gap-1.5`) between label and input within drawer grid
- Supports drawer-specific design requirements (e.g., compact labels, custom colors)

**Rule**: When using explicit labels, always:
- Include `htmlFor` attribute linking to the input's `id`
- Render the required indicator (`<span className="text-error">*</span>`) inside the label
- Do NOT pass the `label` prop to `Input`
- Use `aria-invalid` and `aria-describedby` on the `Input` (handled automatically)

### Validation patterns

#### Basic required field

```jsx
{...register('fieldName', {
  required: 'Field name is required',
})}
```

#### Email with pattern

```jsx
{...register('email', {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
})}
```

#### Phone number (10 digits)

```jsx
{...register('mobileNumber', {
  required: 'Mobile number is required',
  pattern: {
    value: /^[0-9]{10}$/,
    message: 'Enter a valid 10-digit mobile number',
  },
})}
```

#### Custom async validation

```jsx
{...register('username', {
  required: 'Username is required',
  validate: async (value) => {
    const exists = await checkUsernameExists(value);
    return exists ? 'Username already taken' : true;
  },
})}
```

#### Min/max constraints

```jsx
{...register('age', {
  required: 'Age is required',
  min: { value: 18, message: 'Must be 18 or older' },
  max: { value: 120, message: 'Invalid age' },
})}
```

### Multi-field grouped inputs

For related inputs (e.g., first name + last name) with explicit labels, wrap in a fieldset-like div:

```jsx
<div className="space-y-3">
  <label className="block text-xs font-medium text-text-label">
    Full Name <span className="text-error">*</span>
  </label>
  <div className="grid gap-3 md:grid-cols-2">
    <Input
      id="first-name"
      placeholder="First name"
      {...register('firstName', { required: 'First name is required' })}
      error={errors.firstName?.message}
    />
    <Input
      id="last-name"
      placeholder="Last name"
      {...register('lastName', { required: 'Last name is required' })}
      error={errors.lastName?.message}
    />
  </div>
</div>
```

**Note**: This pattern uses explicit labels (no `label` prop on Input). Use this approach in drawers and other constrained layouts. See "Explicit label (drawer forms)" above for detailed explanation.

## Select and dropdown patterns

### Basic Select

Use `Select` from `src/components/ui/Select/Select.jsx`:

```jsx
const RM_OPTIONS = [
  { label: 'Select RM', value: 'unassigned' },
  { label: 'Aarav Shah', value: 'aarav-shah' },
  { label: 'Kavya Mehta', value: 'kavya-mehta' },
];

<Select
  label="Assign RM"
  options={RM_OPTIONS}
  placeholder="Select a relationship manager"
  value={rmValue}
  onValueChange={setRmValue}
  {...register('rm')}
/>
```

### Select with Controller (react-hook-form)

For complex Select behavior, use `Controller`:

```jsx
import { Controller } from 'react-hook-form';
import { Select } from '@components/ui/Select/Select';

<Controller
  name="rm"
  control={control}
  rules={{ required: 'RM assignment is required' }}
  render={({ field }) => (
    <Select
      label="Assign RM"
      options={RM_OPTIONS}
      placeholder="Select RM"
      value={field.value}
      onValueChange={field.onChange}
      error={errors.rm?.message}
    />
  )}
/>
```

### Multi-select pattern

If multi-select is needed, extend Select or use a custom Radix-backed component:

```jsx
{/* Future: MultiSelect component following Select API */}
<MultiSelect
  label="Select Tags"
  options={tagOptions}
  value={selectedTags}
  onValueChange={setSelectedTags}
/>
```

## Error handling and validation

### Field-level errors

Errors are displayed below each input:

```jsx
<Input
  label="Email"
  {...register('email', { required: 'Email is required' })}
  error={errors.email?.message}
/>
```

The `Input` component automatically:
- Renders error text in red
- Sets `aria-invalid="true"` and `aria-describedby` on the input
- Links error message via id for screen readers

### Form-level errors

For errors that span multiple fields or are not field-specific, render an error banner at the top:

```jsx
{formError && (
  <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl flex items-center gap-3">
    <AlertCircle className="h-5 w-5 flex-shrink-0" />
    <p>{formError}</p>
  </div>
)}
```

Example from LoginForm:
```jsx
{loginError && (
  <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
    <AlertCircle className="h-6 w-6 flex-shrink-0" />
    <p>{loginError}</p>
  </div>
)}
```

### Real-time validation feedback

Use `mode: 'onBlur'` or `'onChange'` in `useForm` to show errors as user interacts:

```jsx
const { register, formState: { errors } } = useForm({
  mode: 'onBlur', // Show errors after field is blurred
  defaultValues: { email: '', password: '' },
});
```

## Complete form examples

### Simple login form pattern

See [src/features/auth/components/LoginForm.jsx](../src/features/auth/components/LoginForm.jsx):

- Uses `react-hook-form` with email + password
- Real-time validation on blur
- Password toggle button (eye icon)
- Form-level error banner
- Submit button with loading state
- Navigate on success

### Multi-field creation form pattern

See [src/features/clients/components/CreateClientDrawer.jsx](../src/features/clients/components/CreateClientDrawer.jsx):

- Embedded in a `Drawer` component
- Uses `Controller` for `Select` field
- Grid layout: 3 columns on wide, responsive
- Custom labels with required indicators
- Footer action buttons linked via `form="id"`
- Resets form state on drawer close

## State management in forms

### Local form state (react-hook-form)

For transient form data (not persisted), use `react-hook-form` alone:

```jsx
const { register, handleSubmit, watch } = useForm({
  defaultValues: { email: '', password: '' },
});

const onSubmit = (data) => {
  // data = { email: '...', password: '...' }
};
```

### Prefilling from API data

Use `defaultValues` with data from React Query:

```jsx
const { data: user } = useQuery(['user', userId], fetchUser);

const { register } = useForm({
  defaultValues: user || {}, // Populates fields with existing data
});
```

### Updating after submit

Invalidate React Query cache after successful mutation:

```jsx
const { mutate: updateUser } = useMutation(updateUserAPI, {
  onSuccess: () => {
    queryClient.invalidateQueries(['user']);
  },
});
```

### Redux integration (discouraged for form state)

Do NOT store ephemeral form data in Redux. Redux is only for auth and layout preferences per `code-standards.md`.

## Accessibility rules (enforced)

**A11Y Rule FRM1**: All form inputs must have associated `<label>` elements or visible label text.

**A11Y Rule FRM2**: Required fields must be marked with a visual indicator (e.g., red asterisk) AND aria-label or labelText must include "required".

**A11Y Rule FRM3**: Validation errors must be:
- Visible in the DOM
- Linked to the input via `aria-describedby`
- Announced on change for real-time validation

**A11Y Rule FRM4**: Form submission must handle focus management:
- On error: focus first invalid field
- On success: show confirmation or navigate away

**A11Y Rule FRM5**: Icon-only buttons (e.g., password toggle) must have `aria-label`.

## Responsive form behavior

### Mobile stacking

Use Tailwind grid breakpoints to stack fields vertically on mobile:

```jsx
{/* Stacks on mobile, 2 columns on tablet, 3 on desktop */}
<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  <Input />
  <Input />
  <Input />
</div>
```

### Full-width inputs on mobile

Button and input widths should stack to `w-full` on mobile:

```jsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button type="button" className="w-full sm:w-auto" variant="outline">
    Cancel
  </Button>
  <Button type="submit" className="w-full sm:w-auto">
    Submit
  </Button>
</div>
```

### Drawer vs Modal on mobile

For creation/edit forms:
- Desktop: Use `Drawer` (right-slide, preserves context)
- Mobile: Consider `side="bottom"` or full-height drawer

```jsx
<Drawer
  side="right"
  size="lg"
  // On mobile, consider a full-width bottom drawer
  // Use media query helper or responsive logic if needed
>
  {/* Form content */}
</Drawer>
```

## Common patterns

### Create/edit modal or drawer

For drawer forms, use **explicit labels** (do NOT pass `label` prop to Input):

```jsx
export const CreateItemDrawer = ({ open, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', category: '' },
  });

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const onSubmit = (data) => {
    // API call here
    reset();
    onOpenChange(false);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      title="Create New Item"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-form" isLoading={isSubmitting}>
            Create
          </Button>
        </>
      }
    >
      <form id="create-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Use explicit labels in drawer forms - do NOT pass label prop */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="item-name"
            className="px-1 text-xs font-medium text-text-label"
          >
            Name <span className="text-error">*</span>
          </label>
          <Input
            id="item-name"
            placeholder="Enter item name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="item-email"
            className="px-1 text-xs font-medium text-text-label"
          >
            Email <span className="text-error">*</span>
          </label>
          <Input
            id="item-email"
            type="email"
            placeholder="Enter email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message}
          />
        </div>
      </form>
    </Drawer>
  );
};
```

**Important**: Drawer forms use explicit `<label>` elements, not the Input `label` prop. This provides better control over spacing and styling within the drawer layout.

### Search / filter form

```jsx
export const SearchForm = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, category });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1"
      />
      <Select
        options={categoryOptions}
        value={category}
        onValueChange={setCategory}
      />
      <Button type="submit">Search</Button>
    </form>
  );
};
```

### Inline edit (table cell)

```jsx
export const EditableCell = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div onClick={() => setIsEditing(true)} className="cursor-pointer">
        {value}
      </div>
    );
  }

  return (
    <Input
      autoFocus
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setIsEditing(false);
      }}
    />
  );
};
```

## Testing forms

### Manual testing checklist

- [ ] All fields are keyboard accessible (`Tab`, `Shift+Tab`)
- [ ] Form submission works with mouse and keyboard (Enter key)
- [ ] Validation errors appear on blur or submit
- [ ] Error messages are read aloud by screen reader
- [ ] Submit button disables/shows spinner during submission
- [ ] Form resets after successful submission
- [ ] On mobile, fields stack and are full-width
- [ ] On mobile, buttons stack and are full-width

### Unit test example (Jest + React Testing Library)

```jsx
import { render, screen, userEvent } from '@testing-library/react';
import { CreateItemForm } from './CreateItemForm';

test('submits form with valid data', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();

  render(<CreateItemForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText('Name'), 'Test Item');
  await user.type(screen.getByLabelText('Email'), 'test@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'Test Item',
    email: 'test@example.com',
  });
});

test('shows error for invalid email', async () => {
  const user = userEvent.setup();

  render(<CreateItemForm onSubmit={jest.fn()} />);

  await user.type(screen.getByLabelText('Email'), 'invalid-email');
  await user.click(screen.getByLabelText('Name'));
  await user.click(screen.getByLabelText('Email'));

  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
});
```

## Common pitfalls (avoid)

1. **Using `label` prop in drawer forms**: In drawer forms, define labels explicitly with `<label>` elements instead of passing the `label` prop to Input. See "Input label patterns" section.
2. **Not resetting form on close**: Always reset form state when drawer/modal closes to avoid stale data.
3. **Using `onChange` for validation**: Use `react-hook-form` validation rules instead.
4. **No loading state on submit**: Always set `isLoading` prop on submit button during mutation.
5. **Ignoring accessibility**: Always include labels (explicit or via prop), error messaging, and focus management.
6. **Mixing form state sources**: Use only `react-hook-form` for form data; do NOT duplicate in Redux.
7. **Unstyled errors**: Always use the `error` prop on inputs; don't render errors manually.
8. **No confirmation feedback**: After successful submission, always navigate, show toast, or reset form visibly.

## Links and references

- [react-hook-form docs](https://react-hook-form.com/)
- [Input component](../src/components/ui/Input/Input.jsx)
- [Select component](../src/components/ui/Select/Select.jsx)
- [Button component](../src/components/ui/Button/Button.jsx)
- [LoginForm example](../src/features/auth/components/LoginForm.jsx)
- [CreateClientDrawer example](../src/features/clients/components/CreateClientDrawer.jsx)
- [Drawer component](../src/components/ui/Drawer/Drawer.jsx)
