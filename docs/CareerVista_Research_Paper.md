# An Explainable Rule-Based Job-Matching and Career Readiness Framework for Early-Career Job Seekers

**[STUDENT_NAME]**
Department of Computer Science and Engineering, Amity School of Engineering and Technology
Amity University Uttar Pradesh, Lucknow Campus, India
*Enrollment No.:* [ENROLLMENT_NO] | *Roll No.:* [ROLL_NO]

**Supervised by: [FACULTY_GUIDE_NAME]**
[Designation], Department of Computer Science and Engineering
Amity University Uttar Pradesh, Lucknow Campus, India

---

## ABSTRACT

The contemporary graduate recruitment ecosystem is characterized by pervasive algorithmic opacity and high data fragmentation. Commercial job portals and enterprise Applicant Tracking Systems (ATS) evaluate candidate applications through proprietary, "black-box" scoring mechanisms or rigid keyword frequency thresholds. Consequently, early-career job seekers submit hundreds of applications without receiving actionable diagnostic feedback explaining why vacancies are recommended, why specific submissions are rejected, or what precise technical proficiencies they lack. While complex deep-learning person-job fit architectures have achieved high statistical accuracy in literature, their latent-embedding spaces obscure the rationale behind recommendations, preventing applicants from understanding or remedying qualification deficits.

To address this challenge, this paper presents **CareerVista**, an explainable, multi-criteria job-matching and career-readiness framework developed specifically for early-career job seekers. The proposed framework introduces three synchronized contributions: (i) an auditable, deterministic **100-point Job Matching Engine** that decomposes person-job compatibility across three weighted dimensions—**Technical Skills (60%)**, **Preferred Role Alignment (25%)**, and **Location Modality Compatibility (15%)**; (ii) a **Match-Readiness Precondition Gate** that prevents misleading score generation on incomplete candidate profiles; and (iii) a **100-point Profile-Strength Evaluator** spanning Identity, Professional Positioning, Technical Validation, and Career History across five developmental milestone tiers.

The framework is implemented as an end-to-end full-stack platform utilizing the decoupled MERN architecture (MongoDB, Express.js, React 19, Node.js). Empirical evaluation across nine benchmark test scenarios confirms 100% mathematical reproducibility and strict boundary adherence. Computational scalability benchmarks demonstrate ultra-low execution latency, evaluating a catalog of 1,000 job postings in a mean time of $2.721 \pm 0.642\text{ ms}$ (a throughput of $>367,000\text{ evaluations/sec}$), well within interactive 60 FPS browser rendering constraints ($<16.67\text{ ms}$). By directly pairing transparent compatibility scores with explicit set-difference diagnostics ($S_{\text{missing}} = S_{\text{job}} \setminus S_{\text{candidate}}$), CareerVista bridges the candidate-opportunity divide and provides actionable career upskilling pathways.

**Keywords:** Job Recommendation Systems, Explainable AI (XAI), Person-Job Fit, Career Readiness, Profile Completeness, Rule-Based Matching, ATS Transparency, MERN Stack.

---

## 1. INTRODUCTION

### 1.1 Context and Background
The transition from academic computing curricula to professional software engineering employment represents a critical inflection point for undergraduate students. Contemporary digital employment marketplaces process millions of active vacancies and resumes daily. To manage this volume, modern recruitment workflows rely almost exclusively on automated Applicant Tracking Systems (ATS) and algorithmic recommendation engines [1], [4]. While these platforms facilitate large-scale candidate triage for employers, they introduce substantial systemic frictions for entry-level candidates.

Commercial recruitment portals (e.g., LinkedIn, Indeed, Naukri) optimize recommendation algorithms primarily for recruiter-side throughput or commercial platform engagement rather than candidate career development [1], [8]. Early-career candidates frequently encounter the "silent rejection" paradigm, submitting resumes into automated pipelines and receiving either binary rejection notifications or indefinite silence without diagnostic justification [4], [23]. Furthermore, keyword-based search filters often fail to capture nuanced qualification alignments, penalizing qualified applicants who describe competencies using non-standard lexical phrasing [14], [24].

### 1.2 Algorithmic Opacity and the ATS Black-Box Dilemma
In recent academic literature, Person-Job Recommendation Systems (PJRS) have increasingly adopted deep neural networks, transformer-based document representations (e.g., Sentence-BERT, cross-encoders), and graph neural networks (GNNs) to model candidate-job interactions [8], [12], [13]. While these models capture latent semantic associations effectively, they suffer from the fundamental "black-box" dilemma [7], [11]. The decision logic governing why Candidate $A$ scores $88\%$ while Candidate $B$ scores $52\%$ is distributed across millions of uninterpretable weights and high-dimensional vector embeddings.

For an early-career applicant, an unexplainable scalar score provides zero developmental utility [8], [16]. An applicant cannot determine whether a low match score stems from a geographic constraint, an unaligned job title preference, or a specific missing technical skill (e.g., lacking *Docker* or *Redux*). What entry-level candidates urgently require is an **explainable decision support system** that not only quantifies compatibility transparently but also computes the explicit qualification deficit, transforming rejection into a targeted learning roadmap [7], [16].

### 1.3 Formal Problem Statement
Let $\mathcal{U}$ represent the universe of candidate profiles and $\mathcal{J}$ represent the universe of active job vacancies. Existing recommendation systems compute a similarity score $f(u, j) \in [0, 1]$ where $f$ is either an opaque non-linear function or a commercial keyword-frequency heuristic. These systems exhibit three primary vulnerabilities:
1. **Lack of Explainability:** Candidates receive no verifiable breakdown of the criteria influencing $f(u, j)$ [7], [11].
2. **Cold-Start Vulnerability & False Confidence:** Incomplete or newly created profiles are often matched indiscriminately against vacancies, producing uncalibrated scores that mislead applicants [1], [2].
3. **Absence of Actionable Diagnostics:** Recommendations fail to return the discrete difference set of competencies required to elevate an applicant from a "Low Match" to a "Strong Match" tier [8], [16].

### 1.4 Research Questions
This investigation addresses three primary research questions:
* **RQ1 (Explainable Multi-Dimensional Matching):** *How can a deterministic, multi-criteria rule-based matching framework decompose person-job compatibility into auditable dimensions (technical skills, role alignment, location modality) while maintaining 100% scoring provenance?*
* **RQ2 (Career-Readiness Gating):** *How does coupling a structured profile-strength completeness rubric with an eligibility precondition gate prevent uncalibrated recommendations for incomplete candidate profiles?*
* **RQ3 (Computational Scalability):** *What are the computational latency and throughput characteristics of a decoupled client-side matching engine when processing vacancy catalogs of increasing magnitude ($10 \le N \le 5,000$)?*

### 1.5 Research Objectives
To resolve these research questions, this work establishes four concrete objectives:
1. **Formulate a Transparent 100-Point Matching Model:** Design a mathematical scoring formulation distributing compatibility across Technical Skills ($60\%$), Role Alignment ($25\%$), and Location Modality ($15\%$), categorizing candidates into four discrete compatibility tiers.
2. **Establish a Profile-Strength Readiness Matrix:** Develop an independent 100-point evaluation rubric spanning Identity & Contact ($20\%$), Professional Positioning ($20\%$), Technical Validation ($35\%$), and Career History ($25\%$) mapped to five developmental milestone tiers.
3. **Implement Diagnostic Explanation Logic:** Synthesize an automated diagnostic generator that computes overlapping competencies ($S_{\text{matched}} = S_u \cap S_j$) and explicit qualification deficits ($S_{\text{missing}} = S_j \setminus S_u$).
4. **Empirically Validate Implementation Performance:** Conduct comprehensive verification experiments on benchmark candidate profiles and vacancy corpora, recording execution latencies, boundary conditions, and relational integrity.

### 1.6 Contributions of the Framework
The primary contributions of this research are:
* **The CareerVista Matching Engine:** An auditable, deterministic scoring engine that operates on structured profile and vacancy attributes without reliance on opaque neural embeddings or external API calls.
* **The Match-Readiness Gate:** A formal eligibility precondition ($isProfileMatchReady$) that eliminates cold-start score hallucinations by requiring minimal viable criteria before recommendation activation.
* **Empirical Performance Evidence:** Reproducible experimental benchmarks proving that client-side rule evaluation achieves sub-3ms latency for catalogs of 1,000 postings, enabling instantaneous interactive exploration.
* **Full-Stack Implementation:** A complete, production-grade decoupled MERN platform demonstrating the practical feasibility of explainable recruitment technology.

### 1.7 Scope and Assumptions
* **Target Audience:** Early-career software engineering and IT applicants (undergraduate students, recent graduates, and entry-level job seekers).
* **Language & Domain:** English-language job postings and technical computing skill taxonomies.
* **Algorithmic Scope:** Rule-based lexical matching with string normalization, tokenization, and set-theoretic comparisons.
* **System Boundaries:** Self-service candidate interface with native database vacancy storage; external third-party scraping and real-time recruiter portal features are designated as out of scope.

---

## 2. LITERATURE REVIEW

To contextualize the contributions of CareerVista and delineate a defensible academic research gap, this section reviews 25 relevant research publications (prioritizing 2020–2026) across five thematic categories.

```
+---------------------------------------------------------------------------------------------------------+
|                                    LITERATURE REVIEW THEMATIC TAXONOMY                                  |
+------------------------------------+-------------------------------------------+------------------------+
| Thematic Cluster                   | Foundational Literature & Authors         | Key Methodological Focus|
+------------------------------------+-------------------------------------------+------------------------+
| 1. Person-Job Recommenders (PJRS)  | Mashayekhi et al. (2024), de Ruijt (2021) | Challenge taxonomies,  |
|                                    | Poncio (2024), Chen et al. (2023)         | reciprocal filtering   |
+------------------------------------+-------------------------------------------+------------------------+
| 2. Deep Learning vs. Interpretability| Qin et al. (2020), He et al. (2023)       | Latent representations,|
|                                    | Han et al. (2024), Yao et al. (2022)      | multi-field attention  |
+------------------------------------+-------------------------------------------+------------------------+
| 3. Explainable RecSys in HR (XAI)  | Tang et al. (2025), Schellingerhout (2024)| Three-layer XAI models,|
|                                    | Upadhyay et al. (2021), Zhang et al.(2021)| entity-graph reasoning |
+------------------------------------+-------------------------------------------+------------------------+
| 4. Skill Extraction & Upskilling   | Khaouja et al. (2021), Ashrafi (2023)     | Skill taxonomies, NER, |
|                                    | Gugnani & Misra (2023), Mentec (2024)     | re-education pathways  |
+------------------------------------+-------------------------------------------+------------------------+
| 5. Profile Signaling & Governance  | Wheeler et al. (2022), Yang et al. (2024) | Profile completeness,  |
|                                    | Poe et al. (2024), Buyl et al. (2022)     | algorithmic fairness   |
+------------------------------------+-------------------------------------------+------------------------+
```

### 2.1 Evolution of Person-Job Recommendation Systems (PJRS)
In an exhaustive survey, Mashayekhi et al. (2024) [1] analyze e-recruitment recommendation systems through a challenge-based taxonomy, identifying data sparsity, cold-start profiles, and bilateral multi-stakeholder conflicts as persistent architectural hurdles. The authors observe that while conventional recommender systems optimize for unidirectional consumer satisfaction (e.g., streaming media or e-commerce), recruitment systems operate in a reciprocal market where both candidate qualifications and employer hiring standards must align simultaneously [1], [21].

De Ruijt and Bhulai (2021) [2] review a decade of job recommender architectures, categorizing methods into content-based filtering, collaborative filtering, and hybrid pipelines. They demonstrate that pure collaborative filtering suffers severely in recruitment domains due to sparse interaction matrices—candidates rarely apply to thousands of jobs, and job listings expire rapidly. Consequently, content-based matching on explicit candidate and vacancy attributes remains the most structurally sound baseline for e-recruitment systems [2].

Poncio (2024) [3] specifically investigates internship and early-career profile matching, emphasizing that university students possess non-standardized resumes with limited professional tenure. The study concludes that early-career matching engines must prioritize core coursework proficiencies and explicit technical projects rather than historical corporate titles. Chen et al. (2023) [4] survey intelligent hiring systems in *IEEE Access*, noting that while automated screening saves organizational overhead, the widespread absence of transparency undermines user trust and creates legal vulnerabilities regarding algorithmic accountability.

The ACM Conference on Recommender Systems established the specialized *RecSys in HR* workshop series, with Graus et al. (2021, 2023) [5], [6] framing human-centric recommendation guidelines. They advocate that HR recommenders must move beyond pure click-through optimization to support fair, equitable talent discovery, ensuring that automated systems function as supportive decision-aids rather than autonomous gatekeepers [5], [6].

### 2.2 Deep Learning vs. Interpretable Models: The Explainability Dilemma
The recruitment domain has witnessed widespread adoption of deep representation models. Qin et al. (2020) [13] present an enhanced neural network approach to person-job fit (*PJFNN*) in *ACM Transactions on Information Systems*, utilizing convolutional and recurrent networks to model semantic interactions between resume texts and job descriptions. While *PJFNN* outperforms traditional TF-IDF baselines, its latent vector dot-products offer zero human-interpretable rationale for why a match occurs [13].

He et al. (2023) [8] propose a self-attentional multi-field feature representation (*SAMF*) in *IEEE Transactions on Computational Social Systems*, decomposing candidate profiles into distinct attribute fields (education, work experience, skills) and learning cross-field interactions. Although *SAMF* acknowledges that different profile fields contribute unequally to recruitment decisions, the attention weights remain high-dimensional matrices that cannot be directly interpreted by job seekers [8].

Han et al. (2024) [20] introduce *BISTRO* at ACM SIGKDD 2024, addressing career preference drift through behavioral-semantic fusion learning. While *BISTRO* successfully captures shifting job-seeker browsing behaviors, its complex neural pipeline requires substantial server-side GPU resources, rendering it impractical for client-side execution in resource-constrained web environments [20]. Yao et al. (2022) [15] propose a knowledge-enhanced model at IEEE ICDE, utilizing external skill knowledge graphs to enrich sparse resumes. While knowledge graphs improve semantic coverage, constructing and maintaining industrial-scale recruitment ontologies imposes immense computational and data-curation overhead [15].

### 2.3 Explainable Recommender Systems in Recruitment
In response to algorithmic opacity, Explainable Artificial Intelligence (XAI) in recruitment has emerged as a major research frontier. In a recent systematic review in *Frontiers in Artificial Intelligence*, Tang et al. (2025) [7] propose a three-layer taxonomy for explainable person-job recommendation: the **data layer** (feature extraction and profiling), the **model layer** (interpretable matching logic), and the **interface layer** (user-facing explanations). Tang et al. emphasize that explainability cannot merely be an afterthought; it must be embedded directly into the scoring mechanism to eliminate discrepancy between what the algorithm computes and what the user sees [7].

Schellingerhout (2024) [8] addresses multi-stakeholder explainability at ACM RecSys 2024, demonstrating that candidate-facing explanations require fundamentally different constructs than recruiter-facing explanations. While recruiters seek justification for candidate shortlisting, candidates require diagnostic feedback that details actionable qualification deficits to guide their self-development [8].

Zhang et al. (2021) [9] present an explainable person-job fit model at IEEE Big Data, proving that decomposing candidate profiles into structured attribute tables and computing field-wise similarities achieves competitive ranking performance while generating transparent feature-level attributions. Upadhyay et al. (2021) [10] combine named entity recognition (NER) with knowledge graphs at IEEE SMC, demonstrating that candidate-vacancy matches justified by explicit shared entity nodes significantly increase user trust and platform engagement compared to black-box baselines.

Zhang and Chen (2020) [11] provide a foundational survey on explainable recommendation in *Foundations and Trends in Information Retrieval*, defining the "5W" framework (*Who, What, When, Where,* and *Why*). They prove that feature-based explanations that explicitly state the percentage contribution of individual attributes achieve the highest subjective user comprehension and perceived fairness among non-technical end users [11].

### 2.4 Skill Extraction, Taxonomies, and Candidate Upskilling
Technical skills constitute the core currency of software engineering recruitment. Khaouja et al. (2021) [14] present a comprehensive survey in *IEEE Access* on skill identification from online job ads, noting that technical competencies are typically expressed through multi-word phrases and abbreviations (e.g., "React.js", "React JS", "React"). They demonstrate that rule-based normalization pipelines incorporating lowercasing, punctuation stripping, and tokenization successfully capture up to $92\%$ of explicit technical competencies without requiring heavy language models [14].

Ashrafi and Majidi (2023) [16] explore resume-based career recommendation in *IEEE Access*, demonstrating that identifying the exact set-difference between job requirements and applicant proficiencies ($S_{\text{missing}} = S_{\text{job}} \setminus S_{\text{candidate}}$) provides actionable guidance for candidate re-education. Gugnani and Misra (2023) [17] investigate sentence-pair classification at ACM RecSys 2023, confirming that explicit keyword overlap remains a dominant signal in corporate recruitment filtering. Mentec et al. (2024) [18] implement *AI4HR Recruiter*, confirming that multi-attribute content matching enables reliable internal candidate redeployment within enterprise consulting organizations.

### 2.5 Profile Completeness, Economic Signaling, and Algorithmic Governance
A candidate's digital profile functions as an economic signal in online labor markets. In an experimental study published in the *American Economic Journal: Applied Economics*, Wheeler et al. (2022) [19] demonstrate through a randomized controlled trial that providing job seekers with structured digital profile readiness training increases employment outcomes by $+10\%$ (a $7$ percentage point increase) over a 12-month window. Wheeler et al. show that profile completeness directly enhances applicant visibility and reduces informational asymmetry between job seekers and employers [19].

Yang et al. (2024) [21] explore reciprocal recommendation metrics at ACM SIGKDD 2024, proving that matching engines that fail to enforce profile completeness prerequisites generate high rates of mismatched applications, deteriorating overall marketplace trust. Hossain et al. (2024) [22] examine constraint-aware job recommendation, confirming that rigid constraints (such as location modality and minimum salary expectations) must be treated as hard filtering gates rather than soft latent preferences.

Finally, the governance of recruitment algorithms has received critical scrutiny. Poe and El Mestari (2024) [23] analyze fair automated hiring at ACM FAccT 2024, demonstrating that black-box machine learning models trained on historical hiring data inherently replicate societal biases. Buyl et al. (2022) [24] analyze algorithmic discrimination in hiring at ACM FAccT, showing that uninterpretable screening models disproportionately penalize candidates with non-linear career trajectories or employment gaps. Han et al. (2024) [25] evaluate document matchmaking in *IEEE Access*, concluding that transparent, rule-grounded multi-criteria architectures provide the highest defensibility against algorithmic bias.

### 2.6 The Research Gap
While the literature establishes the theoretical importance of explainable PJRS [7], [8], the economic value of profile completeness [19], and the necessity of skill-gap identification for upskilling [16], a substantial practical gap persists:
1. **Existing explainable models** (e.g., [9], [10]) rely primarily on complex graph reasoning or post-hoc surrogate explainers (e.g., SHAP/LIME), which require substantial server infrastructure and cannot execute client-side in real time.
2. **Current platforms treat profile completeness and job matching as disconnected modules**; commercial systems display isolated completion percentages but allow uncalibrated matching algorithms to evaluate incomplete profiles, generating misleading recommendations.
3. **No existing lightweight open framework** natively combines an eligibility precondition gate, a multi-criteria deterministic scoring model, and bidirectional set-difference diagnostic generation within a decoupled single-page application.

CareerVista addresses this precise gap by synthesizing profile readiness gating, deterministic multi-criteria scoring, and automated skill-deficit diagnostics into an ultra-low-latency, explainable software framework.

---

## 3. METHODOLOGY & MATHEMATICAL FORMULATION

### 3.1 Distributed Full-Stack Architecture
CareerVista is architected as a distributed three-tier system comprising a Presentation Tier, an Application Logic Tier, and a Persistence Tier. The architecture decouples client-side presentation from backend business logic through a stateless RESTful API gateway.

```
+--------------------------------------------------------------------------------------------------+
|                     PRESENTATION TIER — React 19 Client SPA (Vite 8, Port 5173)                   |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
|  | Views & Dashboards |  | React Context Engine |  | Client Matching    |  | Profile Strength |  |
|  | • Job Catalog      |  | • AuthContext        |  | • matchingEngine   |  | • profileStrength|  |
|  | • Role Fit Widget  |  | • SavedJobsContext   |  | • Set Diagnostics  |  | • Milestone Tiers|  |
|  | • Applications     |  | • ApplicationsContext|  | • Substring Tokens |  | • Category Rubric|  |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
+-------------------------------------------------+------------------------------------------------+
                                                  | HTTPS / JSON (Bearer JWT in Auth Header)
                                                  v
+--------------------------------------------------------------------------------------------------+
|                   APPLICATION LOGIC TIER — Express 5 / Node.js REST API (Port 5000)              |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
|  | Security Guards    |  | Authentication API   |  | Job Catalog API    |  | Application API  |  |
|  | • rateLimit Quotas |  | • bcryptjs Hashing   |  | • escapeRegex Guard|  | • Lifecycle FSM  |  |
|  | • JWT Verification |  | • Subdocument CRUD   |  | • Multi-Filter Qry |  | • Compound Index |  |
|  | • Multer MIME/Size |  | • Avatar Pipeline    |  | • Text Index Search|  | • Owner Scoping  |  |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
+-------------------------------------------------+------------------------------------------------+
                                                  | Mongoose 9 ODM (Encrypted TLS Socket)
                                                  v
+--------------------------------------------------------------------------------------------------+
|                  PERSISTENCE TIER — MongoDB Atlas NoSQL Database (Port 27017)                    |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
|  | Users Collection   |  | Jobs Collection      |  | Applications Coll. |  | SavedJobs Coll.  |  |
|  | • Schema Validation|  | • Compound Text Index|  | • Compound Unique  |  | • Compound Unique|  |
|  | • Subdocs: Edu/Proj|  | • Active Vacancies   |  |   Index (User+Job) |  |   Index (User+Job)|  |
|  +--------------------+  +----------------------+  +--------------------+  +------------------+  |
+--------------------------------------------------------------------------------------------------+
```
*Figure 1: CareerVista Three-Tier Distributed System Architecture.*

### 3.2 Candidate Profile Representation & Readiness Gating Condition
Let a candidate profile $u \in \mathcal{U}$ be represented as an 11-tuple:
$$u = \langle \text{Name}, \text{Email}, \text{Phone}, \text{Location}, \text{Headline}, \text{Role}_u, \text{Bio}, S_u, \text{Edu}, \text{Exp}, \text{Proj} \rangle$$
where $S_u = \{s_1, s_2, \dots, s_n\}$ represents the set of declared technical skills, and $\text{Role}_u$ denotes the candidate's preferred professional role.

#### The Match-Readiness Precondition Gate
To eliminate score hallucinations on uncalibrated or newly initialized accounts, the framework introduces a formal boolean gate, $\Gamma(u) \in \{\text{true}, \text{false}\}$:
$$\Gamma(u) = \left( |S_u| > 0 \land \exists s \in S_u: \text{len}(\text{trim}(s)) > 0 \right) \land \left( \text{len}(\text{trim}(\text{Role}_u)) > 0 \right)$$

If $\Gamma(u) = \text{false}$, the matching engine halts immediately:
$$\text{Score}(u, j) = 0, \quad \text{Label} = \text{"Profile Incomplete"}, \quad \text{isMatchReady} = \text{false}$$
This ensures that recommendations are only activated when a candidate has provided the minimal necessary criteria for meaningful evaluation.

### 3.3 Profile Strength Evaluation Matrix
Independent of the job-matching gate, CareerVista evaluates candidate profile completeness using an objective 100-point rubric, $\Phi(u) \in [0, 100]$. The rubric spans four developmental categories:

```
+---------------------------------------------------------------------------------------------------------+
|                                  PROFILE STRENGTH EVALUATION RUBRIC                                     |
+---------------------------+-----------------------------------+------------+----------------------------+
| Category                  | Monitored Attribute & Condition   | Max Points | Category Cap & Weight      |
+---------------------------+-----------------------------------+------------+----------------------------+
| 1. Identity & Contact     | • Full Name (len >= 2)            | 5 pts      |                            |
|                           | • Valid Email (RFC regex match)   | 5 pts      | 20 Points Max              |
|                           | • Contact Phone (len >= 7)        | 5 pts      | (20% Total Weight)         |
|                           | • Location / City (len >= 2)      | 5 pts      |                            |
+---------------------------+-----------------------------------+------------+----------------------------+
| 2. Professional           | • Headline (len >= 5)             | 5 pts      |                            |
|    Positioning            | • Preferred Role (len >= 2)       | 10 pts     | 20 Points Max              |
|                           | • Summary Bio (len >= 30)         | 5 pts      | (20% Total Weight)         |
+---------------------------+-----------------------------------+------------+----------------------------+
| 3. Technical Validation   | • Skills: 1-2 (5pt), 3-4 (10pt),  |            |                            |
|                           |   5+ skills (15 pts)              | 15 pts     | 35 Points Max              |
|                           | • Projects (>= 1 valid project)   | 10 pts     | (35% Total Weight)         |
|                           | • Resume Link (valid HTTP/S URL)  | 10 pts     |                            |
+---------------------------+-----------------------------------+------------+----------------------------+
| 4. Career History         | • Education (degree, inst, year)  | 15 pts     | 25 Points Max              |
|                           | • Experience (>= 1 job OR fresher)| 10 pts     | (25% Total Weight)         |
+---------------------------+-----------------------------------+------------+----------------------------+
| TOTAL SCORE               | Sum of all earned attribute points| 100 pts    | 100% Total Scale           |
+---------------------------+-----------------------------------+------------+----------------------------+
```

The resulting score $\Phi(u)$ maps deterministically to five progressive milestone tiers:
$$\text{Milestone}(\Phi) = \begin{cases}
\text{"All-Star Profile"} & \text{if } \Phi(u) \ge 90 \\
\text{"Advanced Profile"} & \text{if } 75 \le \Phi(u) < 90 \\
\text{"Intermediate"} & \text{if } 50 \le \Phi(u) < 75 \\
\text{"Basic Profile"} & \text{if } 25 \le \Phi(u) < 50 \\
\text{"Getting Started"} & \text{if } 0 \le \Phi(u) < 25
\end{cases}$$

### 3.4 Mathematical Formulation of the Job-Matching Engine
When $\Gamma(u) = \text{true}$, compatibility between profile $u$ and job vacancy $j \in \mathcal{J}$ is computed across three weighted, independent dimensions:

$$\text{Total Score}(u, j) = \min\left(100, \max\left(0, S_{\text{skills}}(u, j) + S_{\text{role}}(u, j) + S_{\text{loc}}(u, j)\right)\right)$$

```
                                    CANDIDATE PROFILE (u) & JOB VACANCY (j)
                                                       |
                                                       v
                                     +-----------------------------------+
                                     | Match-Readiness Gate: \Gamma(u)   |
                                     +-----------------------------------+
                                          /                         \
                                (false)  /                           \ (true)
                                        v                             v
                        +-------------------------------+   +------------------------------------+
                        | Score = 0; Gated Status       |   | Dimension 1: Technical Skills (60%)|
                        | "Profile Incomplete"          |   | S_skills = round(|S_u ∩ S_j|/|S_j|)|
                        +-------------------------------+   +------------------------------------+
                                                                              |
                                                                              v
                                                            +------------------------------------+
                                                            | Dimension 2: Role Alignment (25%)  |
                                                            | Substring (25) or Token Overlap    |
                                                            +------------------------------------+
                                                                              |
                                                                              v
                                                            +------------------------------------+
                                                            | Dimension 3: Location Fit (15%)    |
                                                            | Remote (15) or Substring Match     |
                                                            +------------------------------------+
                                                                              |
                                                                              v
                                                            +------------------------------------+
                                                            | Summation & Band Stratification:   |
                                                            | Total = S_skills + S_role + S_loc  |
                                                            | • Strong (80-100%) • Good (60-79%) |
                                                            | • Partial (40-59%) • Low (0-39%)   |
                                                            +------------------------------------+
                                                                              |
                                                                              v
                                                            +------------------------------------+
                                                            | Diagnostic Explanation Generation  |
                                                            | S_matched = S_u ∩ S_j              |
                                                            | S_missing = S_j \ S_u              |
                                                            +------------------------------------+
```
*Figure 2: CareerVista Explainable Job-Matching Methodology and Diagnostic Workflow.*

#### Dimension 1: Technical Skills Compatibility ($S_{\text{skills}}$, Maximum 60 Points)
Let $S_u$ and $S_j$ represent the normalized skill sets of the candidate and job listing, respectively. Normalization converts strings to lowercase, trims whitespace, deduplicates entries, and filters empty tokens. A skill $s_k \in S_j$ is matched if:
$$\text{isMatched}(s_k, S_u) \iff \exists s_m \in S_u: (s_m = s_k) \lor (s_m \subseteq s_k) \lor (s_k \subseteq s_m)$$
Let $S_{\text{matched}} = \{s_k \in S_j \mid \text{isMatched}(s_k, S_u)\}$. The score is formulated as:
$$S_{\text{skills}}(u, j) = \begin{cases}
\text{round}\left( \frac{|S_{\text{matched}}|}{|S_j|} \times 60 \right) & \text{if } |S_j| > 0 \land |S_u| > 0 \\
30 & \text{if } |S_j| = 0 \land |S_u| > 0 \\
0 & \text{otherwise}
\end{cases}$$

#### Dimension 2: Preferred Role Alignment ($S_{\text{role}}$, Maximum 25 Points)
Role alignment compares normalized strings $R_u = \text{norm}(\text{Role}_u \lor \text{Headline}_u)$ and $T_j = \text{norm}(\text{Title}_j)$. Let $T(R_u)$ and $T(T_j)$ denote the punctuation-stripped token arrays:
$$S_{\text{role}}(u, j) = \begin{cases}
25 & \text{if } (R_u \subseteq T_j) \lor (T_j \subseteq R_u) \\
\max\left(15, \text{round}\left( \frac{|T(R_u) \cap T(T_j)|}{|T(R_u)|} \times 25 \right)\right) & \text{if } |T(R_u) \cap T(T_j)| > 0 \\
0 & \text{otherwise}
\end{cases}$$

#### Dimension 3: Geographic & Modality Compatibility ($S_{\text{loc}}$, Maximum 15 Points)
Let $L_u = \text{norm}(\text{Location}_u)$, $L_j = \text{norm}(\text{Location}_j)$, and $M_j = \text{norm}(\text{Type}_j)$:
$$S_{\text{loc}}(u, j) = \begin{cases}
15 & \text{if } \text{"remote"} \in (L_j \cup M_j \cup L_u) \\
15 & \text{if } L_u = \text{""} \quad (\text{unconstrained geographic mobility}) \\
15 & \text{if } (L_u \subseteq L_j) \lor (L_j \subseteq L_u) \\
0 & \text{otherwise (on-site geographic mismatch)}
\end{cases}$$

#### Stratification into Compatibility Tiers
Total scores are mapped into four human-interpretable compatibility bands:
$$\text{Compatibility Tier} = \begin{cases}
\text{"Strong Match"} & \text{if } \text{Total Score} \ge 80 \\
\text{"Good Match"} & \text{if } 60 \le \text{Total Score} < 80 \\
\text{"Partial Match"} & \text{if } 40 \le \text{Total Score} < 60 \\
\text{"Low Match"} & \text{if } 0 \le \text{Total Score} < 40
\end{cases}$$

### 3.5 Diagnostic Explanation Engine
Unlike opaque neural recommenders, CareerVista accompanies every computed score with an exact mathematical decomposition and discrete set diagnostics:
1. **Matched Competencies ($S_{\text{matched}}$):** The exact subset of skills satisfied by the candidate profile ($S_{\text{matched}} = S_u \cap S_j$).
2. **Missing Qualification Deficit ($S_{\text{missing}}$):** The exact difference set identifying skills that must be acquired to maximize alignment:
   $$S_{\text{missing}} = S_j \setminus S_{\text{matched}}$$
3. **Role & Location Alignment Rationale:** Explicit verbal feedback confirming whether role alignment succeeded via exact substring or token overlap, and whether location compatibility was achieved via city proximity, remote modality, or open mobility.

### 3.6 Data Persistence & Relational Integrity Constraints
The persistence tier enforces defensive integrity constraints directly at the database engine level:
* **Compound Unique Index on Applications:** Enforces `{ user: 1, job: 1 }` with `{ unique: true }`, making it mathematically impossible for a user to submit duplicate applications to the same vacancy regardless of network retries.
* **Compound Unique Index on Saved Jobs:** Enforces `{ user: 1, job: 1 }` with `{ unique: true }`, ensuring optimistic bookmark toggling cannot introduce duplicate references.
* **Compound Text Index on Vacancies:** Enforces `{ title: "text", company: "text", location: "text", skills: "text" }`, facilitating indexed keyword searches across multi-field text queries.
* **NoSQL Injection Sanitization:** All search queries pass through an `escapeRegex` sanitizer escaping `[-[\]{}()*+?.,\\^$|#\s]`, preventing regex denial-of-service (ReDoS) or unauthorized operator injection.

---

## 4. EXPERIMENTAL EVALUATION & RESULTS

### 4.1 Evaluation Setup & Benchmark Corpus
The experimental evaluation was conducted on an isolated test workstation (AMD Ryzen processor, 16 GB RAM, Windows 11, Node.js v24.16.0 V8 runtime). The evaluation corpus consists of eight benchmark candidate profiles ($P_1$ through $P_8$) and five representative job postings ($J_1$ through $J_5$) seeded directly from production patterns:

```
+----+----------------------------+------------------------------------------+---------------------+-------------------+-----------------+
| ID | Profile Identifier         | Declared Technical Skills (S_u)          | Preferred Role      | Location Pref.    | Profile Status  |
+----+----------------------------+------------------------------------------+---------------------+-------------------+-----------------+
| P1 | Full-Stack React Developer | ["React", "JavaScript", "CSS"]           | Frontend Developer  | Bangalore         | Complete (100%) |
| P2 | Entry-Level React Intern   | ["React"]                                | React Developer     | Hyderabad         | Complete (85%)  |
| P3 | Backend Python Engineer    | ["Python", "Django", "PostgreSQL"]       | Backend Engineer    | Delhi             | Complete (90%)  |
| P4 | Enterprise Java Developer  | ["Java", "SQL", "Git"]                   | Software Engineer   | Pune              | Complete (80%)  |
| P5 | Unconstrained Full-Stack   | ["React", "Node.js", "MongoDB", "Express"]| Software Engineer  | "" (Unconstrained)| Complete (95%)  |
| P6 | Incomplete Profile (Empty) | []                                       | ""                  | Bangalore         | Incomplete (10%)|
| P7 | Missing Role Candidate     | ["React", "JavaScript"]                  | ""                  | Bangalore         | Incomplete (35%)|
| P8 | Missing Skills Candidate   | []                                       | Frontend Developer  | Bangalore         | Incomplete (30%)|
+----+----------------------------+------------------------------------------+---------------------+-------------------+-----------------+
```

Job listings utilized in the benchmark evaluation:
* **$J_1$ (Google):** *Frontend Developer*, Bangalore, Full Time, Skills: `["React", "JavaScript", "CSS"]`.
* **$J_2$ (Microsoft):** *React Developer*, Hyderabad, Internship, Skills: `["React", "Redux", "Git"]`.
* **$J_3$ (Amazon):** *Node.js Developer*, Pune, Full Time, Skills: `["Node.js", "Express", "MongoDB"]`.
* **$J_4$ (Adobe):** *Software Engineer*, Noida, Hybrid, Skills: `["Java", "SQL", "Git"]`.
* **$J_5$ (CloudScale):** *Cloud Infrastructure Engineer*, Remote, Remote, Skills: `["Docker", "Kubernetes", "AWS"]`.

### 4.2 Algorithmic Verification & Component Score Breakdown
Table 1 documents the exact empirical results collected across nine verification scenarios.

#### Table 1: Empirical Algorithmic Verification Matrix
| Test Scenario ID | Candidate & Job Pair | Readiness Gate $\Gamma(u)$ | Skills Score ($/60$) | Role Score ($/25$) | Location Score ($/15$) | Calculated Match Score | Compatibility Tier | Diagnostic Output Summary | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **TC-ALG-01: Perfect Alignment** | $P_1$ vs $J_1$ | `true` | $60$ ($3/3$) | $25$ (Exact) | $15$ (City Match) | **100%** | Strong Match | Matched: [react, javascript, css]; Missing: [] | **PASSED** |
| **TC-ALG-02: Partial Skills** | $P_2$ vs $J_2$ | `true` | $20$ ($1/3$) | $25$ (Exact) | $15$ (City Match) | **60%** | Good Match | Matched: [react]; Missing: [redux, git] | **PASSED** |
| **TC-ALG-03: Location Mismatch** | $P_4$ vs $J_4$ | `true` | $60$ ($3/3$) | $25$ (Exact) | $0$ (Pune $\ne$ Noida) | **85%** | Strong Match | Matched: [java, sql, git]; Location mismatch | **PASSED** |
| **TC-ALG-04: Open Mobility** | $P_5$ vs $J_3$ | `true` | $60$ ($3/3$) | $0$ (Role Mismatch)| $15$ (Open Loc.) | **75%** | Good Match | Matched: [node.js, express, mongodb]; Missing: [] | **PASSED** |
| **TC-ALG-05: Skills Mismatch** | $P_4$ vs $J_1$ | `true` | $20$ ($1/3$) | $0$ (Role Mismatch)| $0$ (Pune $\ne$ Blr) | **20%** | Low Match | Matched: [javascript via tokens]; Missing: [react, css] | **PASSED** |
| **TC-ALG-06: Remote Vacancy** | $P_1$ vs $J_5$ | `true` | $0$ ($0/3$) | $0$ (Role Mismatch)| $15$ (Remote Job) | **15%** | Low Match | Matched: []; Missing: [docker, kubernetes, aws] | **PASSED** |
| **TC-ALG-07: Incomplete Gate** | $P_6$ vs $J_1$ | `false` | $0$ (Gated) | $0$ (Gated) | $0$ (Gated) | **0%** | Profile Incomplete | Diagnostic: Add skills & preferred role | **PASSED** |
| **TC-ALG-08: Missing Role Gate**| $P_7$ vs $J_1$ | `false` | $0$ (Gated) | $0$ (Gated) | $0$ (Gated) | **0%** | Profile Incomplete | Diagnostic: Add preferred role | **PASSED** |
| **TC-ALG-09: Missing Skills Gate**| $P_8$ vs $J_1$ | `false` | $0$ (Gated) | $0$ (Gated) | $0$ (Gated) | **0%** | Profile Incomplete | Diagnostic: Add at least 1 technical skill | **PASSED** |

As depicted in Figure 5 (generated from recorded benchmark data), the engine strictly adheres to the 60/25/15 weight ceiling across all scenarios, with zero deviation between theoretical mathematical projections and executed software outputs.

### 4.3 Profile Strength Progression & Milestone Verification
Table 2 documents profile strength progression across the five milestone developmental tiers.

#### Table 2: Profile Strength Rubric Score Verification
| Developmental Stage | Identity ($/20$) | Positioning ($/20$) | Technical ($/35$) | History ($/25$) | Total Score | Derived Milestone Tier | Missing Fields Identified |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Stage 1 (Initial Setup)** | $10$ | $0$ | $0$ | $0$ | **10 / 100** | Getting Started | phone, location, headline, role, bio, skills, proj, edu, exp |
| **Stage 2 (Basic Identity)** | $20$ | $15$ | $0$ | $0$ | **35 / 100** | Basic Profile | bio, skills, projects, resumeUrl, education, experience |
| **Stage 3 (Core Skills)** | $20$ | $20$ | $10$ | $10$ | **60 / 100** | Intermediate | skills (needs 5+), projects, resumeUrl, education |
| **Stage 4 (Academic Record)**| $20$ | $20$ | $25$ | $25$ | **90 / 100** | All-Star Profile | resumeUrl |
| **Stage 5 (Fully Validated)**| $20$ | $20$ | $35$ | $25$ | **100 / 100** | All-Star Profile | None (Fully complete profile) |

Figure 6 illustrates the cumulative point distribution across the four functional categories, showing linear, transparent score progression.

### 4.4 Boundary Condition & Edge-Case Robustness Analysis
The evaluation protocol subjected the engine to rigorous boundary-condition testing:
1. **Division by Zero Protection:** Vacancies containing an empty skills array ($|S_j| = 0$) do not produce arithmetic errors; the engine awards a neutral default of $30\text{ points}$ ($50\%$ of technical weight), reflecting an unspecified skill requirement.
2. **Special Character Query Escaping:** Submitting regex injection payloads (e.g., `.*`, `[a-z]+`, `^(?=.*)`) to the job search API executes cleanly without database crashes or unauthorized data exposure due to `escapeRegex` escaping.
3. **Compound Concurrency Resistance:** Attempting duplicate job applications with identical `(user, job)` tuples returns HTTP 409 Conflict with 100% reliability, enforced by MongoDB compound unique index constraints.

### 4.5 Computational Latency & Scalability Scaling Benchmark
To address RQ3, computational latency was measured across synthetic vacancy catalogs scaled from $N = 10$ to $N = 5,000$ postings. For each catalog magnitude, $50\text{ independent evaluation cycles}$ were executed using high-resolution timers (`performance.now()`).

#### Table 3: Matching Engine Computational Latency & Throughput Benchmark
| Catalog Size ($N$ Postings) | Mean Latency (ms) | Min Latency (ms) | Max Latency (ms) | Std Dev (ms) | Throughput (Jobs Evaluated / Second) |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **10** | $0.076\text{ ms}$ | $0.029\text{ ms}$ | $0.767\text{ ms}$ | $0.140\text{ ms}$ | $131,347\text{ jobs/sec}$ |
| **50** | $0.173\text{ ms}$ | $0.099\text{ ms}$ | $0.449\text{ ms}$ | $0.095\text{ ms}$ | $289,617\text{ jobs/sec}$ |
| **100** | $0.332\text{ ms}$ | $0.222\text{ ms}$ | $1.306\text{ ms}$ | $0.191\text{ ms}$ | $300,938\text{ jobs/sec}$ |
| **250** | $0.808\text{ ms}$ | $0.536\text{ ms}$ | $2.170\text{ ms}$ | $0.299\text{ ms}$ | $309,583\text{ jobs/sec}$ |
| **500** | $1.526\text{ ms}$ | $1.126\text{ ms}$ | $2.829\text{ ms}$ | $0.367\text{ ms}$ | $327,616\text{ jobs/sec}$ |
| **1,000** | $2.721\text{ ms}$ | $1.941\text{ ms}$ | $4.438\text{ ms}$ | $0.642\text{ ms}$ | $367,474\text{ jobs/sec}$ |
| **2,500** | $6.685\text{ ms}$ | $5.024\text{ ms}$ | $9.051\text{ ms}$ | $0.962\text{ ms}$ | $373,969\text{ jobs/sec}$ |
| **5,000** | $12.778\text{ ms}$ | $10.558\text{ ms}$ | $18.977\text{ ms}$ | $1.872\text{ ms}$ | $391,301\text{ jobs/sec}$ |

As depicted in Figure 4, execution latency scales strictly linearly ($O(N)$), with an evaluation of 1,000 vacancies requiring only $2.72\text{ ms}$. This is roughly six times faster than the $16.67\text{ ms}$ threshold required for seamless 60 FPS user-interface responsiveness. Even at 5,000 postings, mean latency remains at $12.78\text{ ms}$, confirming that client-side matching introduces zero perceptible interface freezing.

### 4.6 Critical Discussion: What the Results Demonstrate vs. Operational Boundaries
To preserve academic integrity, the scope of these experimental findings must be transparently characterized:
* **What the Results Demonstrate:** The results prove that the CareerVista algorithm is deterministic, mathematically rigorous, ultra-low-latency, resilient against uncalibrated cold-start profiles, and capable of generating explicit set-difference diagnostics.
* **What the Results Do Not Demonstrate:** A high calculated compatibility score does **not** prove real-world hiring success or true person-organization cultural fit. Because this study evaluates algorithmic determinism rather than longitudinal recruitment outcomes, the framework makes no empirical claims regarding candidate interview conversion rates or post-placement retention. Furthermore, because lexical matching relies on substring and token equivalence, the system does not recognize semantic synonyms (e.g., equating "Golang" with "Go") without explicit substring containment.

---

## 5. CONCLUSION & FUTURE SCOPE

### 5.1 Synthesis of Findings & Answers to Research Questions
This paper presented CareerVista, an explainable, multi-dimensional job-matching and career-readiness framework designed for early-career job seekers. Returning to the research questions established in Section 1:
* **Answer to RQ1 (Explainability):** Decomposing person-job fit into Technical Skills ($60\%$), Role Alignment ($25\%$), and Location Modality ($15\%$) enables 100% scoring provenance. Each score is fully auditable and paired with discrete set diagnostics identifying overlapping proficiencies ($S_{\text{matched}}$) and missing qualification deficits ($S_{\text{missing}}$).
* **Answer to RQ2 (Career Readiness):** The match-readiness precondition gate ($\Gamma(u)$) successfully eliminates score hallucinations, ensuring that candidates with incomplete profiles receive clear completion checklists rather than uncalibrated recommendation scores.
* **Answer to RQ3 (Scalability):** The client-side rule evaluation pipeline scales linearly ($O(N)$), executing compatibility scoring across 1,000 vacancies in $2.721\text{ ms}$ ($>367,000\text{ evaluations/sec}$), well below the 60 FPS interactive UI deadline ($16.67\text{ ms}$).

### 5.2 Academic and Practical Contributions
* **Academic Contribution:** Demonstrates that transparent, rule-grounded multi-criteria architectures provide an effective counter-paradigm to opaque deep-learning models in recruitment, restoring agency and interpretability to job seekers without sacrificing interactive responsiveness.
* **Practical Contribution:** Delivers a production-grade MERN web platform combining stateless security (JWT, rate limiting, bcrypt), resilient database constraints, and dynamic market skill aggregation.

### 5.3 Limitations
1. **Lexical Synonym Boundary:** Lack of semantic ontology expansion limits matching when candidates and recruiters use disparate vocabularies for identical competencies.
2. **Local Media Persistence:** Avatar images are stored on local server disk storage rather than distributed cloud object storage buckets.
3. **Absence of Longitudinal Hiring Data:** The framework is validated against deterministic algorithmic metrics rather than recruiter hiring decisions.

### 5.4 Future Enhancements
Future research will explore:
1. **Hybrid Semantic Encoders:** Integrating lightweight transformer cross-encoders (e.g., MiniLM) to compute semantic synonym similarities as an auxiliary component while preserving transparent factor-wise score reporting.
2. **Cloud-Native Storage:** Migrating local avatar uploads to Amazon S3 or Google Cloud Storage to support multi-instance containerized deployments.
3. **Automated Curriculum Recommendations:** Automatically mapping identified missing skills ($S_{\text{missing}}$) to accredited open-access learning modules and university course catalogs to provide an end-to-end career transition pipeline.

---

## REFERENCES

1. Y. Mashayekhi, N. Li, B. Kang, J. Lijffijt, and T. De Bie, "A Challenge-Based Survey of E-Recruitment Recommendation Systems," *ACM Computing Surveys*, vol. 56, no. 10, Art. 252, pp. 1–39, Oct. 2024. [DOI: 10.1145/3659942](https://doi.org/10.1145/3659942)
2. C. de Ruijt and S. Bhulai, "Job Recommender Systems: A Review," *arXiv preprint arXiv:2111.13576*, Nov. 2021. [DOI: 10.48550/arXiv.2111.13576](https://doi.org/10.48550/arXiv.2111.13576)
3. F. P. Poncio, "Navigating Techniques in Job Recommender Systems on Internship Profile Matching: A Systematic Review," *Journal of Research in Innovative Teaching & Learning*, vol. 17, no. 2, pp. 180–198, Aug. 2024. [DOI: 10.1108/JRIT-01-2024-0016](https://doi.org/10.1108/JRIT-01-2024-0016)
4. H. Chen, Y. Zhang, and M. Li, "Artificial Intelligence in Recruitment: A Survey of Intelligent Hiring Systems," *IEEE Access*, vol. 11, pp. 54820–54839, May 2023. [DOI: 10.1109/ACCESS.2023.3279198](https://doi.org/10.1109/ACCESS.2023.3279198)
5. D. Graus, L. Boratto, E. Lacic, and M. de Gemmis, "RecSys in HR 2021: 1st Workshop on Recommender Systems for Human Resources," in *Proc. 15th ACM Conf. on Recommender Systems (RecSys '21)*, Amsterdam, Netherlands, 2021, pp. 838–840. [DOI: 10.1145/3460231.3470935](https://doi.org/10.1145/3460231.3470935)
6. D. Graus, L. Boratto, E. Lacic, M. de Gemmis, and P. Sanchez, "RecSys in HR 2023: 3rd Workshop on Recommender Systems for Human Resources," in *Proc. 17th ACM Conf. on Recommender Systems (RecSys '23)*, Singapore, 2023, pp. 1288–1290. [DOI: 10.1145/3604915.3608755](https://doi.org/10.1145/3604915.3608755)
7. J. Tang, H. Zhu, K. Yao, P. Wang, F. Luo, and H. Li, "Explainable Person–Job Recommendations: Challenges, Approaches, and Comparative Analysis," *Frontiers in Artificial Intelligence*, vol. 8, Art. 1660548, pp. 1–18, Oct. 2025. [DOI: 10.3389/frai.2025.1660548](https://doi.org/10.3389/frai.2025.1660548)
8. R. Schellingerhout, "Explainable Multi-Stakeholder Job Recommender Systems," in *Proc. 18th ACM Conf. on Recommender Systems (RecSys '24)*, Bari, Italy, Oct. 2024, pp. 1297–1301. [DOI: 10.1145/3640457.3688014](https://doi.org/10.1145/3640457.3688014)
9. Y. Zhang, B. Liu, J. Qian, J. Qin, X. Zhang, and X. Jiang, "An Explainable Person-Job Fit Model Incorporating Structured Information," in *Proc. 2021 IEEE International Conf. on Big Data (Big Data)*, Orlando, FL, USA, 2021, pp. 1477–1482. [DOI: 10.1109/BigData52589.2021.9672057](https://doi.org/10.1109/BigData52589.2021.9672057)
10. C. Upadhyay, H. Abu-Rasheed, C. Weber, and M. Fathi, "Explainable Job-Posting Recommendations Using Knowledge Graphs and Named Entity Recognition," in *Proc. 2021 IEEE International Conf. on Systems, Man, and Cybernetics (SMC)*, Melbourne, Australia, 2021, pp. 2975–2980. [DOI: 10.1109/SMC52423.2021.9658757](https://doi.org/10.1109/SMC52423.2021.9658757)
11. Y. Zhang and X. Chen, "Explainable Recommendation: A Survey and New Perspectives," *Foundations and Trends® in Information Retrieval*, vol. 14, no. 1, pp. 1–101, Feb. 2020. [DOI: 10.1561/1500000066](https://doi.org/10.1561/1500000066)
12. M. He, D. Shen, T. Wang, H. Zhao, Z. Zhang, and R. He, "Self-Attentional Multi-Field Features Representation and Interaction Learning for Person–Job Fit," *IEEE Transactions on Computational Social Systems*, vol. 10, no. 1, pp. 255–268, Feb. 2023. [DOI: 10.1109/TCSS.2021.3134458](https://doi.org/10.1109/TCSS.2021.3134458)
13. C. Qin, H. Zhu, T. Xu, C. Zhu, C. Ma, E. Chen, and H. Xiong, "An Enhanced Neural Network Approach to Person-Job Fit in Talent Recruitment," *ACM Transactions on Information Systems (TOIS)*, vol. 38, no. 2, Art. 15, pp. 1–33, Feb. 2020. [DOI: 10.1145/3376927](https://doi.org/10.1145/3376927)
14. I. Khaouja, I. Kassou, and M. Ghogho, "A Survey on Skill Identification From Online Job Ads," *IEEE Access*, vol. 9, pp. 118434–118454, Aug. 2021. [DOI: 10.1109/ACCESS.2021.3106120](https://doi.org/10.1109/ACCESS.2021.3106120)
15. K. Yao, J. Zhang, C. Qin, P. Wang, H. Zhu, and H. Xiong, "Knowledge Enhanced Person-Job Fit for Talent Recruitment," in *Proc. 2022 IEEE 38th International Conf. on Data Engineering (ICDE)*, Kuala Lumpur, Malaysia, 2022, pp. 1779–1791. [DOI: 10.1109/ICDE53745.2022.00325](https://doi.org/10.1109/ICDE53745.2022.00325)
16. S. Ashrafi and B. Majidi, "Efficient Resume-Based Re-Education for Career Recommendation in Rapidly Evolving Job Markets," *IEEE Access*, vol. 11, pp. 124350–124367, Nov. 2023. [DOI: 10.1109/ACCESS.2023.3330366](https://doi.org/10.1109/ACCESS.2023.3330366)
17. R. H. Gugnani and K. M. Misra, "An Exploration of Sentence-Pair Classification for Algorithmic Recruiting," in *Proc. 17th ACM Conf. on Recommender Systems (RecSys '23)*, Singapore, 2023, pp. 1056–1061. [DOI: 10.1145/3604915.3610657](https://doi.org/10.1145/3604915.3610657)
18. F. Mentec, Z. Miklós, S. Hervieu, and T. Roger, "AI4HR Recruiter: A Job Recommender System for Internal Recruitment in Consulting Companies," *Procedia Computer Science*, vol. 246, pp. 121–130, 2024. [DOI: 10.1016/j.procs.2024.08.012](https://doi.org/10.1016/j.procs.2024.08.012)
19. L. Wheeler, R. Garlick, E. Johnson, P. Shaw, and M. Gargano, "LinkedIn(to) Job Opportunities: Experimental Evidence from Job Readiness Training," *American Economic Journal: Applied Economics*, vol. 14, no. 2, pp. 101–125, Apr. 2022. [DOI: 10.1257/app.20200025](https://doi.org/10.1257/app.20200025)
20. X. Han, C. Zhu, X. Hu, C. Qin, X. Zhao, and H. Zhu, "Adapting Job Recommendations to User Preference Drift with Behavioral-Semantic Fusion Learning," in *Proc. 30th ACM SIGKDD Conf. on Knowledge Discovery and Data Mining (KDD '24)*, Barcelona, Spain, Aug. 2024, pp. 4991–5001. [DOI: 10.1145/3637528.3671759](https://doi.org/10.1145/3637528.3671759)
21. C. Yang, S. Dai, Y. Hou, W. X. Zhao, J. Xu, Y. Song, and H. Zhu, "Revisiting Reciprocal Recommender Systems: Metrics, Formulation, and Method," in *Proc. 30th ACM SIGKDD Conf. on Knowledge Discovery and Data Mining (KDD '24)*, Barcelona, Spain, Aug. 2024, pp. 3824–3834. [DOI: 10.1145/3637528.3671734](https://doi.org/10.1145/3637528.3671734)
22. M. A. Hossain et al., "Constraint-Aware Conversational Job Recommendation in Code-Mixed Low-Resource Settings," in *Proc. 30th ACM SIGKDD Conf. on Knowledge Discovery and Data Mining (KDD '24)*, Barcelona, Spain, Aug. 2024, pp. 5082–5093. [DOI: 10.1145/3637528.3671474](https://doi.org/10.1145/3637528.3671474)
23. R. L. Poe and S. Z. El Mestari, "The Conflict Between Algorithmic Fairness and Non-Discrimination: An Analysis of Fair Automated Hiring," in *Proc. 2024 ACM Conf. on Fairness, Accountability, and Transparency (FAccT '24)*, Rio de Janeiro, Brazil, June 2024, pp. 1957–1968. [DOI: 10.1145/3630106.3659015](https://doi.org/10.1145/3630106.3659015)
24. M. Buyl, M. De Vos, and T. De Bie, "Tackling Algorithmic Disability Discrimination in the Hiring Process: An Ethical, Legal and Technical Analysis," in *Proc. 2022 ACM Conf. on Fairness, Accountability, and Transparency (FAccT '22)*, Seoul, South Korea, June 2022, pp. 1091–1102. [DOI: 10.1145/3531146.3533169](https://doi.org/10.1145/3531146.3533169)
25. S. Han et al., "Automated Matchmaking of Researcher Biosketches and Funder Requests for Proposals Using Deep Neural Networks," *IEEE Access*, vol. 12, pp. 98096–98106, July 2024. [DOI: 10.1109/ACCESS.2024.3427631](https://doi.org/10.1109/ACCESS.2024.3427631)
