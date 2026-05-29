import React, { useState, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@components/ui/Input/Input';
import { Select } from '@components/ui/Select/Select';
import { Button } from '@components/ui/Button/Button';
import { cn } from '@utils/cn';

import {
  Check,
  Code,
  LayoutGrid,
  FileText,
  Trash2,
  UploadCloud,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { PagePlaceholder } from '@/components/ui/PagePlaceholder';

// ==========================================
// PREDEFINED SCHEMA PRESETS
// ==========================================

const FINANCIAL_REPORT_SCHEMA = [
  {
    name: "reportTitle",
    type: "text",
    label: "Report Title",
    placeholder: "Q2 Asset & Allocation Review",
    required: true,
    helperText: "Name your customized export file"
  },
  {
    name: "reportType",
    type: "select",
    label: "Data Module",
    required: true,
    options: [
      { value: "aum", label: "AUM & Flows Analysis" },
      { value: "performance", label: "Portfolio Performance" },
      { value: "transactions", label: "Client Transactions" }
    ],
    defaultValue: "aum"
  },
  {
    name: "dateRange",
    type: "date",
    label: "Reporting Date",
    required: true,
    defaultValue: "2026-05-18"
  },
  {
    name: "includeSubaccounts",
    type: "switch",
    label: "Include Child Portfolios",
    helperText: "Consolidate all associated sub-accounts and trust structures",
    defaultValue: false
  },
  {
    name: "minAumLimit",
    type: "range",
    label: "Min Assets Filter ($k)",
    min: 10,
    max: 1000,
    step: 10,
    defaultValue: 100,
    showIf: { field: "includeSubaccounts", equals: true }
  },
  {
    name: "exportFormat",
    type: "radio",
    label: "Output Format",
    required: true,
    options: [
      { value: "pdf", label: "PDF Report Document" },
      { value: "xlsx", label: "Excel Spreadsheet" },
      { value: "csv", label: "CSV Plain Data" }
    ],
    defaultValue: "pdf"
  },
  {
    name: "applyBranding",
    type: "checkbox",
    label: "Apply White-Label Branding",
    defaultValue: false
  },
  {
    name: "brandingColor",
    type: "color",
    label: "Custom Brand Color",
    defaultValue: "#46a8dc",
    showIf: { field: "applyBranding", equals: true }
  },
  {
    name: "customLogo",
    type: "file",
    label: "Corporate Logo (SVG/PNG)",
    required: true,
    showIf: { field: "applyBranding", equals: true }
  },
  {
    name: "footerNotes",
    type: "textarea",
    label: "Report Footer & Disclaimers",
    placeholder: "Confidential. For client oversight and internal audits only..."
  }
];

const CLIENT_INTAKE_SCHEMA = [
  {
    name: "fullName",
    type: "text",
    label: "Client Full Name",
    placeholder: "Aarav K. Mehta",
    required: true
  },
  {
    name: "email",
    type: "email",
    label: "Corporate Email Address",
    placeholder: "aarav@mehtagroup.com",
    required: true
  },
  {
    name: "accountType",
    type: "select",
    label: "Account Category",
    required: true,
    options: [
      { value: "retail", label: "Retail Individual" },
      { value: "hni", label: "High-Net-Worth Individual" },
      { value: "corporate", label: "Corporate Entity" }
    ],
    defaultValue: "retail"
  },
  {
    name: "corporateId",
    type: "text",
    label: "Corporate Tax Identification Number (TIN)",
    placeholder: "TIN-98765-XYZ",
    required: true,
    showIf: { field: "accountType", equals: "corporate" }
  },
  {
    name: "initialDeposit",
    type: "number",
    label: "Planned Initial Deposit ($ USD)",
    placeholder: "50000",
    required: true,
    min: 1000
  },
  {
    name: "kycDoc",
    type: "file",
    label: "Verify Identity Documents (Passport / ID)",
    required: true
  },
  {
    name: "agreeTerms",
    type: "switch",
    label: "Accept Regulatory Terms & Disclosures",
    helperText: "I agree to let inXits retrieve credit score records under standard compliance guidelines.",
    required: true,
    defaultValue: false
  }
];

const COMPLETE_PLAYBOOK_SCHEMA = [
  {
    name: "textDemo",
    type: "text",
    label: "1. Text Input Type",
    placeholder: "Type some text...",
    required: true
  },
  {
    name: "numberDemo",
    type: "number",
    label: "2. Number Input Type",
    placeholder: "e.g., 42",
    min: 10,
    max: 100,
    required: true,
    helperText: "Validates minimum of 10 and maximum of 100"
  },
  {
    name: "emailDemo",
    type: "email",
    label: "3. Email Input Type",
    placeholder: "your@email.com",
    required: true
  },
  {
    name: "passwordDemo",
    type: "password",
    label: "4. Password Input Type",
    placeholder: "Enter secure password",
    required: true,
    helperText: "Must include at least 8 characters"
  },
  {
    name: "selectDemo",
    type: "select",
    label: "5. Dropdown Select (Radix)",
    required: true,
    options: [
      { value: "react", label: "React.js Library" },
      { value: "vue", "label": "Vue.js Framework" },
      { value: "angular", "label": "Angular Enterprise" }
    ],
    defaultValue: "react"
  },
  {
    name: "textareaDemo",
    type: "textarea",
    label: "6. Textarea Input Type",
    placeholder: "Write multiple lines of text here..."
  },
  {
    name: "checkboxDemo",
    type: "checkbox",
    label: "7. Standard Checkbox Option",
    defaultValue: false,
    required: true,
    helperText: "Requires acceptance to submit"
  },
  {
    name: "switchDemo",
    type: "switch",
    label: "8. Switch Toggle Type",
    helperText: "Activate glowing glassmorphism dashboard styling",
    defaultValue: false
  },
  {
    name: "radioDemo",
    type: "radio",
    label: "9. Radio (Segmented Buttons)",
    options: [
      { value: "easy", label: "Easy Mode" },
      { value: "medium", label: "Medium Mode" },
      { value: "hard", label: "Hard Mode" }
    ],
    defaultValue: "medium"
  },
  {
    name: "dateDemo",
    type: "date",
    label: "10. Date Input Type",
    required: true,
    defaultValue: "2026-05-18"
  },
  {
    name: "rangeDemo",
    type: "range",
    label: "11. Range Slider Type",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50
  },
  {
    name: "colorDemo",
    type: "color",
    label: "12. Color Picker Type",
    defaultValue: "#46a8dc"
  },
  {
    name: "fileDemo",
    type: "file",
    label: "13. File Upload Dropzone",
    required: true
  }
];

const PRESETS = {
  reports: FINANCIAL_REPORT_SCHEMA,
  intake: CLIENT_INTAKE_SCHEMA,
  playbook: COMPLETE_PLAYBOOK_SCHEMA
};

// ==========================================
// UTILITY FUNCTIONS FOR SCHEMA RESOLUTION
// ==========================================

const getDefaults = (schema) => {
  const defaults = {};
  schema.forEach(field => {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      switch (field.type) {
        case 'checkbox':
        case 'switch':
          defaults[field.name] = false;
          break;
        case 'select':
          defaults[field.name] = field.options?.[0]?.value || '';
          break;
        case 'range':
          defaults[field.name] = field.min || 0;
          break;
        default:
          defaults[field.name] = '';
      }
    }
  });
  return defaults;
};

const buildZodSchema = (schema) => {
  const shape = {};

  schema.forEach(field => {
    let validator;

    if (field.type === 'email') {
      let emailValidator = z.string().trim().email('Invalid email address');
      if (field.required) {
        emailValidator = emailValidator.min(1, `${field.label || field.name} is required`);
      } else {
        emailValidator = emailValidator.optional().or(z.literal(''));
      }
      validator = emailValidator;

    } else if (field.type === 'number' || field.type === 'range') {
      let numValidator = z.number({
        required_error: `${field.label || field.name} is required`,
        invalid_type_error: 'Must be a valid number'
      });

      if (field.min !== undefined) {
        numValidator = numValidator.min(field.min, `Value must be at least ${field.min}`);
      }
      if (field.max !== undefined) {
        numValidator = numValidator.max(field.max, `Value must be at most ${field.max}`);
      }

      let processed = z.preprocess((val) => {
        if (val === '' || val === null || val === undefined) {
          return undefined;
        }
        const parsed = Number(val);
        return isNaN(parsed) ? undefined : parsed;
      }, numValidator);

      if (!field.required) {
        processed = processed.optional();
      }

      validator = processed;

    } else if (field.type === 'checkbox' || field.type === 'switch') {
      let boolValidator = z.boolean();
      if (field.required) {
        boolValidator = boolValidator.refine((val) => val === true, 'This parameter is required');
      } else {
        boolValidator = boolValidator.optional();
      }
      validator = boolValidator;

    } else if (field.type === 'file') {
      let fileValidator = z.any();
      if (field.required) {
        fileValidator = fileValidator.refine((val) => val && val.name, 'Document upload is required');
      } else {
        fileValidator = fileValidator.optional();
      }
      validator = fileValidator;

    } else {
      // standard string inputs: text, password, date, textarea, select, radio, color
      let strValidator = z.string().trim();
      if (field.required) {
        strValidator = strValidator.min(1, `${field.label || field.name} is required`);
      } else {
        strValidator = strValidator.optional().or(z.literal(''));
      }
      validator = strValidator;
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
};

const checkCondition = (condition, formValues) => {
  if (!condition) return true;
  const { field, equals, notEquals } = condition;
  const targetValue = formValues?.[field];

  if (equals !== undefined) return targetValue === equals;
  if (notEquals !== undefined) return targetValue !== notEquals;
  return true;
};

// ==========================================
// CUSTOM PREMIUM UI FORM FIELDS
// ==========================================

const CustomTextarea = React.forwardRef(({ label, error, helperText, required, id, ...props }, ref) => {
  const isError = !!error;
  return (
    <div className="flex flex-col w-full gap-1.5 animate-in fade-in duration-300">
      <div className="relative group w-full">
        <div className={cn(
          'relative flex items-start transition-all duration-200 rounded-xl border p-4 bg-transparent w-full min-h-[110px]',
          'border-stroke-divider hover:border-white/40',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
          isError && 'border-error hover:border-error/80 focus-within:border-error focus-within:ring-error/20'
        )}>
          {label && (
            <label className="absolute left-3 font-medium transition-all duration-200 pointer-events-none z-10 bg-page text-[12px] px-1 leading-none -top-2 text-text-label group-focus-within:text-primary">
              {label} {required && <span className="text-error font-bold">*</span>}
            </label>
          )}
          <textarea
            ref={ref}
            id={id}
            className="w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-heading text-sm font-medium placeholder:text-paragraph/30 placeholder:font-normal resize-y min-h-[80px] custom-scrollbar"
            {...props}
          />
        </div>
      </div>
      {(isError || helperText) && (
        <span className={cn("text-[11px] font-medium px-1", isError ? "text-error" : "text-text-label/50")}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});
CustomTextarea.displayName = 'CustomTextarea';

const CustomCheckbox = React.forwardRef(({ label, error, helperText, required, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 px-1 animate-in fade-in duration-300">
      <label className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-text-label select-none">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            "w-5 h-5 rounded border border-stroke-divider bg-transparent flex items-center justify-center transition-all duration-200 group-hover:border-white/40 peer-checked:bg-primary peer-checked:border-primary",
            error && "border-error"
          )}>
            <Check className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform duration-200" />
          </div>
        </div>
        <span className="leading-tight">
          {label} {required && <span className="text-error font-bold">*</span>}
        </span>
      </label>
      {helperText && !error && <span className="text-[11px] text-text-label/50 px-8 leading-tight">{helperText}</span>}
      {error && <span className="text-[11px] font-medium text-error px-8">{error}</span>}
    </div>
  );
});
CustomCheckbox.displayName = 'CustomCheckbox';

const CustomSwitch = React.forwardRef(({ label, error, helperText, required, id, checked, onChange, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1 w-full animate-in fade-in duration-300">
      <label className="flex items-center justify-between cursor-pointer group p-3.5 rounded-xl bg-white/5 border border-stroke-divider hover:border-white/20 transition-all duration-200">
        <span className="text-sm font-semibold text-text-label flex flex-col gap-0.5 max-w-[80%] select-none">
          <span>{label} {required && <span className="text-error font-bold">*</span>}</span>
          {helperText && <span className="text-xs font-normal text-paragraph/60 leading-normal">{helperText}</span>}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            "w-11 h-6 rounded-full bg-white/10 transition-colors duration-200 peer-checked:bg-primary group-hover:bg-white/15",
            error && "border border-error"
          )} />
          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-text-heading transition-all duration-200 transform peer-checked:translate-x-5 shadow-lg shadow-black/40" />
        </div>
      </label>
      {error && <span className="text-[11px] font-medium text-error px-1">{error}</span>}
    </div>
  );
});
CustomSwitch.displayName = 'CustomSwitch';

const CustomRange = React.forwardRef(({ label, error, helperText, required, min = 0, max = 100, step = 1, value, onChange, id, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full gap-2 animate-in fade-in duration-300">
      <div className="flex justify-between items-center px-1">
        <label className="text-sm font-semibold text-text-label">
          {label} {required && <span className="text-error font-bold">*</span>}
        </label>
        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          {value !== undefined ? value : min}
        </span>
      </div>
      <div className="relative flex items-center w-full group py-1">
        <input
          type="range"
          ref={ref}
          id={id}
          min={min}
          max={max}
          step={step}
          value={value !== undefined ? value : min}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none transition-all duration-200"
          {...props}
        />
      </div>
      {helperText && !error && <span className="text-[11px] text-text-label/50 px-1">{helperText}</span>}
      {error && <span className="text-[11px] text-error font-medium px-1">{error}</span>}
    </div>
  );
});
CustomRange.displayName = 'CustomRange';

const CustomRadio = React.forwardRef(({ label, error, helperText, required, options = [], value, onChange, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full animate-in fade-in duration-300">
      <label className="text-sm font-semibold text-text-label px-1">
        {label} {required && <span className="text-error font-bold">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2.5">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200 select-none text-center h-12",
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-lg"
                  : "bg-transparent border-stroke-divider text-paragraph hover:border-white/30"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                {...props}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {helperText && !error && <span className="text-[11px] text-text-label/50 px-1 leading-tight">{helperText}</span>}
      {error && <span className="text-[11px] text-error font-medium px-1">{error}</span>}
    </div>
  );
});
CustomRadio.displayName = 'CustomRadio';

const CustomColor = React.forwardRef(({ label, error, helperText, required, value, onChange, ...props }, ref) => {
  const PRESET_COLORS = [
    '#46a8dc', // Primary Blue
    '#2bc76f', // Success Green
    '#ea5455', // Error Red
    '#eaf120', // Warning Yellow
    '#9b59b6', // Amethyst Purple
    '#e67e22', // Ember Orange
  ];

  const activeColor = value || '#46a8dc';

  return (
    <div className="flex flex-col gap-2 w-full animate-in fade-in duration-300">
      <label className="text-sm font-semibold text-text-label px-1">
        {label} {required && <span className="text-error font-bold">*</span>}
      </label>
      <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-stroke-divider rounded-xl p-3.5">
        <div className="flex items-center gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={cn(
                "w-7 h-7 rounded-full transition-all duration-200 transform hover:scale-110 flex items-center justify-center ring-offset-bg-page ring-1 ring-white/10",
                activeColor.toLowerCase() === color.toLowerCase() ? "scale-105 ring-2 ring-white" : "opacity-80 hover:opacity-100"
              )}
              style={{ backgroundColor: color }}
            >
              {activeColor.toLowerCase() === color.toLowerCase() && (
                <Check className="w-3.5 h-3.5 text-white stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-[1px] h-6 bg-stroke-divider mx-1" />

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <input
            type="color"
            value={activeColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-stroke-divider p-0.5 overflow-hidden transition-all duration-200 hover:border-white/30"
            {...props}
          />
          <span className="text-xs font-semibold text-subheading font-mono select-all">
            {activeColor.toUpperCase()}
          </span>
        </div>
      </div>
      {helperText && !error && <span className="text-[11px] text-text-label/50 px-1">{helperText}</span>}
      {error && <span className="text-[11px] text-error font-medium px-1">{error}</span>}
    </div>
  );
});
CustomColor.displayName = 'CustomColor';

const CustomFile = React.forwardRef(({ label, error, helperText, required, value, onChange, ...props }, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(value || null);

  useEffect(() => {
    if (!value) {
      setUploadedFile(null);
    } else if (value && typeof value === 'object') {
      setUploadedFile(value);
    }
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (fileName) => {
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          const mockFile = { name: fileName, size: '2.4 MB' };
          setUploadedFile(mockFile);
          onChange(mockFile);
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0].name);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadedFile(null);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full animate-in fade-in duration-300">
      <label className="text-sm font-semibold text-text-label px-1">
        {label} {required && <span className="text-error font-bold">*</span>}
      </label>

      {uploadedFile ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-primary/20 bg-primary/5 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <FileText className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-heading truncate max-w-[180px] sm:max-w-xs">{uploadedFile.name}</p>
              <p className="text-xs text-paragraph/60 font-semibold">{uploadedFile.size || '2.4 MB'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-lg text-paragraph hover:text-error hover:bg-error/10 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : uploading ? (
        <div className="p-6 rounded-xl border border-stroke-divider bg-white/5 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <div className="w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs font-semibold text-subheading animate-pulse">Uploading Document... {progress}%</p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative p-6 rounded-xl border border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer text-center",
            dragActive
              ? "border-primary bg-primary/5 scale-[0.99] border-solid"
              : "border-stroke-divider bg-transparent hover:border-white/30 hover:bg-white/5"
          )}
        >
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            onChange={handleChange}
            {...props}
          />
          <UploadCloud className="w-8 h-8 text-paragraph/50 group-hover:text-primary transition-colors duration-200" />
          <div>
            <p className="text-sm font-semibold text-heading">
              Drag & Drop file or <span className="text-primary hover:underline font-bold">Browse</span>
            </p>
            <p className="text-xs text-paragraph/60 mt-1 font-semibold">Supports CSV, PDF, SVG up to 10MB</p>
          </div>
        </div>
      )}

      {helperText && !error && <span className="text-[11px] text-text-label/50 px-1 leading-normal">{helperText}</span>}
      {error && <span className="text-[11px] text-error font-medium px-1">{error}</span>}
    </div>
  );
});
CustomFile.displayName = 'CustomFile';

// ==========================================
// CORE FORMIK/REACT-HOOK-FORM ENGINE
// ==========================================

const DynamicFormRenderer = ({ schema, onSubmit, resetCounter }) => {
  const formSchema = useMemo(() => buildZodSchema(schema), [schema]);
  const defaultValues = useMemo(() => getDefaults(schema), [schema]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Keep form values in sync when reset counter changes
  useEffect(() => {
    reset(defaultValues);
  }, [resetCounter, defaultValues, reset]);

  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-5">
        {schema.map((field) => {
          // Conditional Rendering Check
          if (field.showIf) {
            const visible = checkCondition(field.showIf, watchedValues);
            if (!visible) return null;
          }

          const fieldId = `dyn-${field.name}`;

          switch (field.type) {
            case 'select':
              return (
                <div key={field.name} className="flex flex-col gap-1.5 w-full animate-in fade-in duration-300">
                  <label htmlFor={fieldId} className="text-sm font-semibold text-text-label px-1">
                    {field.label} {field.required && <span className="text-error font-bold">*</span>}
                  </label>
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Select
                        id={fieldId}
                        value={controllerField.value}
                        onValueChange={controllerField.onChange}
                        options={field.options}
                        placeholder={field.placeholder || "Select option..."}
                        triggerClassName="h-12 rounded-xl bg-transparent border-stroke-divider hover:border-white/40 focus-visible:ring-primary/20 text-sm"
                      />
                    )}
                  />
                  {field.helperText && <span className="text-[11px] text-text-label/50 px-1">{field.helperText}</span>}
                  {errors[field.name] && (
                    <span className="text-[11px] text-error font-medium px-1">
                      {errors[field.name]?.message}
                    </span>
                  )}
                </div>
              );

            case 'textarea':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomTextarea
                      id={fieldId}
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      {...controllerField}
                    />
                  )}
                />
              );

            case 'checkbox':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomCheckbox
                      id={fieldId}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      checked={controllerField.value}
                      onChange={(e) => controllerField.onChange(e.target.checked)}
                    />
                  )}
                />
              );

            case 'switch':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomSwitch
                      id={fieldId}
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      checked={controllerField.value}
                      onChange={(e) => controllerField.onChange(e.target.checked)}
                    />
                  )}
                />
              );

            case 'radio':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomRadio
                      label={field.label}
                      required={field.required}
                      options={field.options}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              );

            case 'range':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomRange
                      id={fieldId}
                      label={field.label}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              );

            case 'color':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomColor
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              );

            case 'file':
              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <CustomFile
                      label={field.label}
                      required={field.required}
                      error={errors[field.name]?.message}
                      helperText={field.helperText}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                    />
                  )}
                />
              );

            default:
              // Handles text, number, email, password, date dynamically
              return (
                <Input
                  key={field.name}
                  id={fieldId}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  helperText={field.helperText}
                  error={errors[field.name]?.message}
                  containerClassName="animate-in fade-in duration-300"
                  inputClassName="focus:ring-0"
                  {...register(field.name)}
                />
              );
          }
        })}
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl text-sm font-semibold tracking-wide shadow-lg hover:shadow-primary/10 transition-all duration-200 mt-6"
        isLoading={isSubmitting}
        leftIcon={Sparkles}
      >
        Process Dynamic Request
      </Button>

      {/* Live Form Values Viewer */}
      <div className="p-4 rounded-xl bg-white/5 border border-stroke-divider mt-8 space-y-2">
        <h4 className="text-xs font-bold text-subheading tracking-wider uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live Reactive Data State
        </h4>
        <pre className="text-[11px] font-mono text-primary custom-scrollbar max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
          {JSON.stringify(watchedValues, null, 2)}
        </pre>
      </div>
    </form>
  );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [activeSchema, setActiveSchema] = useState(PRESETS.reports);
  const [schemaJsonText, setSchemaJsonText] = useState(JSON.stringify(PRESETS.reports, null, 2));
  const [jsonError, setJsonError] = useState(null);
  const [resetCounter, setResetCounter] = useState(0);
  const [submissions, setSubmissions] = useState([]);

  // Sync schema text area when tabs are clicked
  const handlePresetSelect = (presetKey) => {
    setActiveTab(presetKey);
    const presetSchema = PRESETS[presetKey];
    setActiveSchema(presetSchema);
    setSchemaJsonText(JSON.stringify(presetSchema, null, 2));
    setJsonError(null);
    setResetCounter(prev => prev + 1);
  };

  // Sync schema dynamically when users edit the JSON raw editor
  const handleSchemaJsonChange = (e) => {
    const text = e.target.value;
    setSchemaJsonText(text);

    try {
      if (text.trim() === '') {
        setJsonError('JSON schema is empty.');
        return;
      }
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        setActiveSchema(parsed);
        setJsonError(null);
      } else {
        setJsonError('JSON must be a valid Array of field objects.');
      }
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleFormSubmit = (data) => {
    const newSubmission = {
      timestamp: new Date().toLocaleTimeString(),
      preset: activeTab,
      payload: data
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const handleResetForm = () => {
    setResetCounter(prev => prev + 1);
  };

  return <PagePlaceholder title="Reports" />

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Overview Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stroke-divider pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-heading">Reports Panel</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full mt-1.5">
              Form Rendering Engine
            </span>
          </div>
          <p className="text-sm text-paragraph mt-1">
            Build and render forms at runtime using modular JSON schema blueprints. Edit JSON schemas to adapt validation rules, layouts, and input variables dynamically.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={handleResetForm}>
            Reset Form
          </Button>
        </div>
      </div>

      {/* Two Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: JSON SCHEMA CONTROLLER */}
        <div className="xl:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-stroke-divider shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-heading flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                Schema Configuration
              </h2>
              <span className="text-xs font-medium text-text-label/40">JSON format</span>
            </div>

            {/* Presets Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl mb-4 border border-white/5">
              <button
                onClick={() => handlePresetSelect('reports')}
                className={cn(
                  "py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 truncate",
                  activeTab === 'reports' ? "bg-primary text-text-on-primary shadow" : "text-paragraph hover:text-heading"
                )}
              >
                1. Report Setup
              </button>
              <button
                onClick={() => handlePresetSelect('intake')}
                className={cn(
                  "py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 truncate",
                  activeTab === 'intake' ? "bg-primary text-text-on-primary shadow" : "text-paragraph hover:text-heading"
                )}
              >
                2. Client Intake
              </button>
              <button
                onClick={() => handlePresetSelect('playbook')}
                className={cn(
                  "py-2 px-2.5 rounded-lg text-xs font-bold transition-all duration-200 truncate",
                  activeTab === 'playbook' ? "bg-primary text-text-on-primary shadow" : "text-paragraph hover:text-heading"
                )}
              >
                3. Playbook (All 13)
              </button>
            </div>

            {/* Live Text Area Editor */}
            <div className="relative group rounded-xl border border-stroke-divider bg-black/30 overflow-hidden focus-within:border-primary transition duration-200">
              <textarea
                value={schemaJsonText}
                onChange={handleSchemaJsonChange}
                rows={18}
                className="w-full bg-transparent border-none outline-none focus:ring-0 p-4 font-mono text-[11px] leading-relaxed text-emerald-400/90 custom-scrollbar resize-none"
              />

              {/* Floating Validation Overlay */}
              {jsonError ? (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-error/90 backdrop-blur border-t border-error text-white text-[10px] font-semibold flex items-start gap-1.5 animate-in slide-in-from-bottom-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{jsonError}</span>
                </div>
              ) : (
                <div className="absolute bottom-2 right-2 p-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-wider uppercase rounded px-2">
                  Active & Validated
                </div>
              )}
            </div>

            {/* Pedagogical Hint Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-primary/5 border border-primary/10 space-y-1.5">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" />
                Did you know?
              </h4>
              <p className="text-[11px] leading-normal text-paragraph/80 font-medium">
                Try modifying the schema JSON! You can change a field's <code className="text-primary font-bold">"label"</code>, set <code className="text-primary font-bold">"required": true</code>, or append new objects. The renderer on the right will instantly rebuild.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DYNAMIC RENDERER & RESULTS */}
        <div className="xl:col-span-7 space-y-6">

          {/* RENDERED FORM CONTAINER */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-stroke-divider shadow-2xl relative overflow-hidden backdrop-blur-md">

            {/* Glowing background accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-stroke-divider pb-4 mb-6">
              <h2 className="text-base font-bold text-heading flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-primary animate-pulse" />
                Live Rendered form
              </h2>
              <span className="text-xs font-semibold text-paragraph/60">Reactive UI</span>
            </div>

            {/* Dynamic Form Stitches here */}
            {jsonError ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto border border-error/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-subheading">Form Render Paused</p>
                <p className="text-xs text-paragraph/60 max-w-xs mx-auto">
                  Resolve the syntax schema errors in the JSON configuration editor to resume page validation.
                </p>
              </div>
            ) : (
              <DynamicFormRenderer
                key={activeTab + resetCounter}
                schema={activeSchema}
                onSubmit={handleFormSubmit}
                resetCounter={resetCounter}
              />
            )}
          </div>

          {/* SUBMISSIONS HISTORY */}
          {submissions.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-stroke-divider shadow-xl animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sm font-bold text-heading flex items-center gap-2 border-b border-stroke-divider pb-3 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                Submission Activity Log
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {submissions.map((sub, index) => (
                  <div key={index} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                        Success Submission
                      </span>
                      <span className="text-[10px] font-semibold text-paragraph/50">
                        {sub.timestamp} (Preset: {sub.preset})
                      </span>
                    </div>
                    <pre className="text-[10px] font-mono text-subheading bg-black/20 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                      {JSON.stringify(sub.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
