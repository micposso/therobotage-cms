const fs=require('fs');const file='frontend/src/app/(english)/enterprise/EnterpriseForm.tsx';let s=fs.readFileSync(file,'utf8');
s=s.replace("import cta from '@/components/FoundingCohort/FoundingCohort.module.css'", "import cta from '@/components/FoundingCohort/FoundingCohort.module.css'\nimport { enterpriseContent } from './content'");
const begin=s.indexOf('    {enterpriseFields.map((field) => {');
const end=s.indexOf('    <p className={styles.consent}',begin);
const original=s.slice(begin,end);
const body=original.slice(original.indexOf('      const id'),original.lastIndexOf('    })}'));
s=s.slice(0,begin)+`    {enterpriseFields.filter(field => field.required).map(renderField)}
    <details className={\`\${styles.details} \${styles.optionalFields}\`}><summary>{t('Add deployment details (optional)')}</summary><div className={styles.optionalFieldsGrid}>{enterpriseFields.filter(field => !field.required).map(renderField)}</div></details>
`+s.slice(end);
const anchor="  if (state.success) return";
s=s.replace(anchor,`  function renderField(field: typeof enterpriseFields[number]) {
${body}  }
${anchor}`);
s=s.replace("  useEffect(() => {",`  function focusFirstError() {
    const field = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    const details = field?.closest('details')
    if (details) details.open = true
    field?.focus()
  }
  useEffect(() => {`);
s=s.replace("formRef.current?.querySelector<HTMLElement>('[aria-invalid=\"true\"]')?.focus()",'focusFirstError()');
s=s.replace("requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid=\"true\"]')?.focus())",'requestAnimationFrame(focusFirstError)');
s=s.replace(": 'Request Academy Briefing'",': enterpriseContent.cta');
fs.writeFileSync(file,s);
