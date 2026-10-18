import { protocols } from '@/lib/rxd/registry'
import { dimensionNames, dimensionIds } from '@/lib/rxd/schema'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import styles from './RXDEvaluation.module.css'

const sections = [
 ['Commercial products, verified acquisition', 'The index includes released physical robots with an identifiable manufacturer, a defined function involving people and a verified ownership pathway. Direct purchase, authorized retailers, distributors, formal enterprise quotations and authorized integrators qualify. We record the source, region and verification date. Announcements, prototypes, unshipped crowdfunding, simulations and fleet-only services do not qualify. Development kits can qualify even when integration is required. Previously eligible products may remain clearly archived or temporarily unavailable.'],
 ['Three ways to assess a robot', 'Research Profile (Level 1): verifiable product information, without RXD scores or implied testing. Observational Evaluation (Level 2): contextual behavioral evidence, potentially from continuous demonstrations, independent footage, interviews or published studies. Hands-on Evaluation (Level 3): firsthand tasks with documented configuration, firmware, participants, environment, outcomes and trials. These levels describe methods, not robot quality or maturity. Historical reviews remain unclassified when their evidence is incomplete.'],
 ['Repeatable procedures, human experience', 'NIST response-robot work addresses operational capabilities and operator proficiency. RXD addresses human interpretation, communication, interaction and recovery. We adapt procedural principles: define scenarios and setup, record observable behavior, specify success and failure, document the environment and repeat trials when assessing reliability. Separate operator actions from robot behavior. Compare models only when tasks, conditions and evidence are compatible. One successful trial does not establish consistent performance.'],
 ['Evidence, uncertainty and scores', 'Each observation records its source, access date, context, provenance and limitations. Manufacturer claims are attributed; promotional material alone does not establish independent performance. Failure and recovery require evidence of breakdowns. Recognition rates, times and reliability require recorded measurements. Missing evidence is not negative performance. Evidence quality, coverage and score remain separate. Partial assessments are useful without an overall score.'],
 ['When a score is justified', 'The website retains its six dimensions, 1–5 scale and equal weighting. All six dimensions must meet approved evidence requirements before a complete RXD average is shown. Each score needs traceable observations, an approved protocol and human review. The six protocols below are drafts and cannot yet authorize new scores. Research Profiles have no performance scores.'],
 ['An unresolved scoring difference', 'The existing v2.0 white paper describes four scoring levels, while the website uses five points. Both are preserved. Intermediate five-point behavioral anchors and protocol requirements need editorial approval before new assessments can be published. Methodology 1.0 versions the evidence record; it does not silently replace the published framework.'],
 ['Independent review and revisions', 'AI-assisted assessments must enter human editorial review before publication. Disclose payments, supplied hardware, manufacturer relationships and participation. Manufacturer involvement does not determine scores. Unknown historical disclosures remain unknown. New evidence and software changes may require reassessment; revision records preserve the date, reviewer, prior version, findings and reason for change.'],
]
const references = [
 ['Standard Test Methods for Response Robots', 'https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots'],
 ['Ground Robot Tests', 'https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots/ground-robot-tests'],
 ['Performance of Emergency Response Robots', 'https://www.nist.gov/programs-projects/performance-emergency-response-robots'],
]
export default function Methodology({ locale = 'en' }: { locale?: Locale }) {
 const t = (s: string) => uiText(s, locale)
 return <section className={styles.section} id="how-we-evaluate"><div className={styles.inner}>
  <p className={styles.eyebrow}>{t('Evaluation methodology')} · 1.0</p>
  <h2>{t('How We Evaluate Robots')}</h2>
  <div className={styles.notice}><p>{t("The Robot Age's RXD evaluation methodology incorporates principles of repeatable testing, observable performance measures, and evidence-based assessment informed by the National Institute of Standards and Technology (NIST) Standard Test Methods for Response Robots. RXD is an independently developed human-robot experience framework and is not a NIST standard, certification, or endorsement.")}</p><p>{t('NIST-informed procedures do not establish ASTM compliance. The proposed RXD protocols are internal drafts, not validated scientific standards.')}</p></div>
  {sections.map(([title, body]) => <details key={title} open={title === sections[0][0]}><summary>{t(title)}</summary><div><p>{t(body)}</p></div></details>)}
  <h3 style={{ marginTop: 40 }}>{t('Proposed assessment protocols')}</h3>
  <p>{t('Draft — human review required')}. {t('These internal identifiers are not NIST or ASTM test identifiers.')}</p>
  {protocols.map(p => <details key={p.id}><summary>{p.id} · {t(dimensionNames[dimensionIds.indexOf(p.dimension)])}</summary><div>
    <h4>{t(p.scenarioName)}</h4><p>{t(p.objective)}</p>
    <p>{t('Protocol version')}: {p.version} · {t('Draft — human review required')}</p>
    {(['categories', 'setup', 'instructions', 'observableMeasures', 'evidenceRequirements', 'scoringCriteria', 'limitations'] as const).map(key => <div key={key}><strong>{t(key)}</strong><ul>{p[key].map(value => <li key={value}>{t(value)}</li>)}</ul></div>)}
    {(['measurementApproach', 'minimumEvidence', 'environmentalConsiderations', 'repetitionGuidance', 'successCriterion', 'failureCriterion', 'rubricReference'] as const).map(key => <p key={key}><strong>{t(key)}: </strong>{t(p[key])}</p>)}
  </div></details>)}
  <h3 style={{ marginTop: 40 }}>{t('Methodological references')}</h3><ul>{references.map(([title, url]) => <li key={url}><a href={url}>NIST — {title}</a></li>)}</ul>
 </div></section>
}
