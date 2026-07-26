import { Article, Note, ResearchTask } from '../types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'Uszkoreit, J.', 'Jones, L.'],
    journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
    year: 2024,
    doi: '10.5555/3295222.3295349',
    url: 'https://arxiv.org/abs/1706.03762',
    domain: 'Artificial Intelligence',
    citationCount: 124500,
    tags: ['Transformer', 'Deep Learning', 'Medical Imaging', 'Attention Mechanisms'],
    abstract: 'We present an evaluation of sequence-to-sequence and spatial self-attention models for multi-modal medical diagnostics. By replacing recurrent and convolutional layers entirely with self-attention mechanisms, we demonstrate a 40% reduction in training latency and a 18% improvement in cross-modal biomarker alignment across multi-site clinical datasets.',
    bibtex: `@inproceedings{vaswani2024attention,
  title={Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion},
  booktitle={Advances in Neural Information Processing Systems},
  volume={37},
  pages={5998--6008},
  year={2024}
}`,
    apaCitation: 'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., & Jones, L. (2024). Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics. Advances in Neural Information Processing Systems, 37, 5998–6008.',
    mlaCitation: 'Vaswani, Ashish, et al. "Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics." Advances in Neural Information Processing Systems 37 (2024): 5998-6008.',
    ieeeCitation: 'A. Vaswani, N. Shazeer, N. Parmar, J. Uszkoreit, and L. Jones, "Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics," Adv. Neural Inf. Process. Syst., vol. 37, pp. 5998–6008, 2024.',
    dateAdded: '2026-07-20',
    isFavorite: true,
    summary: {
      executiveSummary: 'This paper benchmarks multi-head self-attention mechanisms in high-dimensional diagnostic imaging, proving that attention mechanisms outperform standard CNNs in capturing long-range contextual spatial relationships across multi-modal scan datasets.',
      keyFindings: [
        'Multi-head attention captures global context in 3D MRI scans 3.2x faster than 3D convolutions.',
        'Reduces false positive biomarker detection in early-stage oncology by 14.2%.',
        'Demonstrates superior transfer learning capabilities across sparse clinical datasets.'
      ],
      methodology: 'Evaluated on 14,000 anonymized multi-institutional clinical scans. Computed multi-head scaled dot-product attention across spatial and temporal slices using distributed GPU clusters.',
      limitations: 'High memory complexity O(N^2) for ultra-high-resolution 4K medical imaging modalities.',
      implications: 'Facilitates real-time diagnostic decision support systems in radiomic pipelines without requiring extensive manual feature annotation.',
      keyQuotations: [
        '"Self-attention mechanisms allow the model to dynamically weight diagnostic regions regardless of spatial distance."'
      ],
      recommendedFutureWork: [
        'Explore linear attention approximations for 3D volumetric ultrasound data.',
        'Integrate uncertainty estimation headers into vision transformer backbones.'
      ],
      criticalReview: {
        strengths: ['Rigorous multi-site validation', 'Clear mathematical framework for multi-modal scaling'],
        weaknesses: ['Requires significant compute resources for fine-tuning on consumer hardware'],
        noveltyScore: 9.5
      }
    }
  },
  {
    id: 'art-2',
    title: 'Solid-State Electrolyte Interfaces with High Nickel Cathodes for Next-Gen Energy Storage',
    authors: ['Goodenough, J. B.', 'Park, K. S.', 'Kim, Y. H.', 'Srinivasan, V.'],
    journal: 'Journal of Power Sources & Electrochemical Energy',
    year: 2025,
    doi: '10.1016/j.jpowsour.2025.23456',
    domain: 'Climate & Energy',
    citationCount: 3410,
    tags: ['Solid-State Battery', 'Energy Density', 'Electrochemistry', 'Lithium Metal'],
    abstract: 'Solid-state lithium batteries offer high energy densities and improved safety over liquid electrolyte counterparts. This study investigates microstructural degradation and interface dendrite suppression at the solid-electrolyte interphase (SEI) using atomic layer deposition coating techniques.',
    bibtex: `@article{goodenough2025solid,
  title={Solid-State Electrolyte Interfaces with High Nickel Cathodes for Next-Gen Energy Storage},
  author={Goodenough, John B and Park, Kyu-Young and Kim, Young-Hwan and Srinivasan, Venkat},
  journal={Journal of Power Sources},
  volume={512},
  pages={23456},
  year={2025}
}`,
    apaCitation: 'Goodenough, J. B., Park, K. S., Kim, Y. H., & Srinivasan, V. (2025). Solid-State Electrolyte Interfaces with High Nickel Cathodes for Next-Gen Energy Storage. Journal of Power Sources, 512, 23456.',
    mlaCitation: 'Goodenough, John B., et al. "Solid-State Electrolyte Interfaces with High Nickel Cathodes for Next-Gen Energy Storage." Journal of Power Sources 512 (2025): 23456.',
    ieeeCitation: 'J. B. Goodenough, K. S. Park, Y. H. Kim, and V. Srinivasan, "Solid-State Electrolyte Interfaces with High Nickel Cathodes for Next-Gen Energy Storage," J. Power Sources, vol. 512, p. 23456, 2025.',
    dateAdded: '2026-07-22',
    isFavorite: false,
    summary: {
      executiveSummary: 'Demonstrates a nanometer-thin artificial SEI buffer layer that prevents lithium dendrite propagation and achieves over 1,200 stable charge-discharge cycles at 450 Wh/kg.',
      keyFindings: [
        'Atomic layer deposition of alumina-zinc oxide suppresses interfacial side reactions by 89%.',
        'Maintains 91.4% capacity retention after 1,000 rapid cycles at room temperature.',
        'Thermal stability threshold elevated to 310°C, eliminating thermal runaway risk.'
      ],
      methodology: 'In-situ X-ray photoelectron spectroscopy combined with operando electron microscopy during high-voltage galvanostatic cycling.',
      limitations: 'ALD process scaling costs remain challenging for mass automotive pack production.',
      implications: 'Paves the way for commercially viable 500 Wh/kg solid-state electric vehicle batteries.',
      keyQuotations: [
        '"Stabilizing the chemo-mechanical stress at the electrode interface is paramount for true long-life lithium metal batteries."'
      ],
      recommendedFutureWork: [
        'Roll-to-roll manufacturing feasibility analysis for ultra-thin composite electrolytes.'
      ],
      criticalReview: {
        strengths: ['In-situ imaging validation', 'High cycle longevity benchmarks'],
        weaknesses: ['Limited lower-temperature performance tests (-20°C)'],
        noveltyScore: 9.1
      }
    }
  },
  {
    id: 'art-3',
    title: 'Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays',
    authors: ['Martinis, J. M.', 'Fowler, A. G.', 'Barends, R.', 'Kelly, J.'],
    journal: 'Physical Review Letters & Quantum Computing',
    year: 2025,
    doi: '10.1103/PhysRevLett.134.120401',
    domain: 'Quantum Computing',
    citationCount: 1890,
    tags: ['Quantum Computing', 'Surface Code', 'Error Correction', 'Superconducting Qubits'],
    abstract: 'Demonstrating physical qubit error rates below the fault-tolerant threshold is a crucial milestone for scalable quantum computing. Here, we demonstrate a distance-5 logical qubit using 41 physical qubits with active real-time syndrome decoding.',
    bibtex: `@article{martinis2025fault,
  title={Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays},
  author={Martinis, John M and Fowler, Austin G and Barends, Rami and Kelly, Julian},
  journal={Physical Review Letters},
  volume={134},
  number={12},
  pages={120401},
  year={2025}
}`,
    apaCitation: 'Martinis, J. M., Fowler, A. G., Barends, R., & Kelly, J. (2025). Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays. Physical Review Letters, 134(12), 120401.',
    mlaCitation: 'Martinis, John M., et al. "Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays." Physical Review Letters 134.12 (2025): 120401.',
    ieeeCitation: 'J. M. Martinis, A. G. Fowler, R. Barends, and J. Kelly, "Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays," Phys. Rev. Lett., vol. 134, no. 12, p. 120401, 2025.',
    dateAdded: '2026-07-24',
    isFavorite: true,
    summary: {
      executiveSummary: 'Presents a landmark achievement in quantum error correction where logical qubit error rates are reduced exponentially relative to physical qubit distance.',
      keyFindings: [
        'Logical qubit error rate reduced from 1.2% to 0.14% when increasing code distance from d=3 to d=5.',
        'Real-time neural network syndrome decoding executed in under 850 nanoseconds.',
        'Crosstalk suppressed via dynamic flux tuning and customized isolation pulses.'
      ],
      methodology: 'Fabricated 72-qubit transmon array with 3D cryogenic wiring interconnects. Implemented repetitive parity measurements across 50 rounds of syndrome extraction.',
      limitations: 'High cryogenic heat load requires continuous dilution refrigerator power.',
      implications: 'Brings fault-tolerant quantum simulation of molecular drug interactions within reach within the decade.',
      keyQuotations: [
        '"Quantum error suppression below threshold transforms theoretical quantum mechanics into scalable engineering."'
      ],
      recommendedFutureWork: [
        'Scaling up to distance-7 and distance-9 surface codes on 100+ qubit chips.'
      ],
      criticalReview: {
        strengths: ['Real-time sub-microsecond decoding', 'Exponential scaling evidence'],
        weaknesses: ['Substantial physical qubit overhead required per logical qubit'],
        noveltyScore: 9.8
      }
    }
  },
  {
    id: 'art-4',
    title: 'Neural Oscillations during Memory Consolidation in Human Hippocampal Networks',
    authors: ['Buzsáki, G.', 'Moser, E. I.', 'Pfeiffer, B. E.', 'Dragoi, G.'],
    journal: 'Nature Neuroscience & Cognitive Dynamics',
    year: 2024,
    doi: '10.1038/s41593-024-01892-z',
    domain: 'Cognitive Neuroscience',
    citationCount: 4120,
    tags: ['Neuroscience', 'Memory Consolidation', 'Hippocampus', 'Sharp-Wave Ripples'],
    abstract: 'Memories formed during wakefulness undergo neural replay during non-REM sleep via sharp-wave ripple (SWR) oscillations. Utilizing high-density neuropixels probes in human patients, we record thousands of single-unit spike trains to uncover temporal compression mechanisms in CA3-CA1 circuitry.',
    bibtex: `@article{buzsaki2024neural,
  title={Neural Oscillations during Memory Consolidation in Human Hippocampal Networks},
  author={Buzs{\'a}ki, Gy{\"o}rgy and Moser, Edvard I and Pfeiffer, Brad E and Dragoi, George},
  journal={Nature Neuroscience},
  volume={27},
  pages={1450--1461},
  year={2024}
}`,
    apaCitation: 'Buzsáki, G., Moser, E. I., Pfeiffer, B. E., & Dragoi, G. (2024). Neural Oscillations during Memory Consolidation in Human Hippocampal Networks. Nature Neuroscience, 27, 1450–1461.',
    mlaCitation: 'Buzsáki, György, et al. "Neural Oscillations during Memory Consolidation in Human Hippocampal Networks." Nature Neuroscience 27 (2024): 1450-1461.',
    ieeeCitation: 'G. Buzsáki, E. I. Moser, B. E. Pfeiffer, and G. Dragoi, "Neural Oscillations during Memory Consolidation in Human Hippocampal Networks," Nat. Neurosci., vol. 27, pp. 1450–1461, 2024.',
    dateAdded: '2026-07-21',
    isFavorite: false,
    summary: {
      executiveSummary: 'Discovers that sleep sharp-wave ripples replay spatial and episodic memory cell sequences at a 20x temporally compressed speed, directly driving neocortical synaptic plasticity.',
      keyFindings: [
        'Recorded 2,400 simultaneous hippocampal single neurons in human subjects undergoing presurgical monitoring.',
        'SWR disruption via targeted electrical stimulation degraded next-day recall accuracy by 34%.',
        'Identified pre-configured neural ensembles that facilitate rapid zero-shot sequence learning.'
      ],
      methodology: 'Intracranial Neuropixels recording in epilepsy surgical candidates performing virtual navigation tasks prior to nocturnal sleep.',
      limitations: 'Human recordings restricted to clinical epilepsy patient populations.',
      implications: 'Informs therapeutic targeted memory reactivation techniques for neurodegenerative disorders.',
      keyQuotations: [
        '"Sharp-wave ripples represent nature’s biological mechanism for converting volatile electrical activity into persistent structural memory."'
      ],
      recommendedFutureWork: [
        'Investigate non-invasive auditory stimulation for closed-loop ripple enhancement in aging adults.'
      ],
      criticalReview: {
        strengths: ['Direct human single-unit electrophysiology', 'Controlled causal perturbation paradigms'],
        weaknesses: ['Sample size limited to n=12 clinical patients'],
        noveltyScore: 9.4
      }
    }
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    articleId: 'art-1',
    articleTitle: 'Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics',
    title: 'Key Takeaways for Radiomic Pipeline Integration',
    content: `## Integration Plan for Multi-Modal Medical Scans
- **Spatial Complexity**: Standard self-attention scales $O(N^2)$. Need to implement linear attention or shifted windows (Swin) for 3D MRI volumes exceeding $512 \\times 512 \\times 128$.
- **Validation Metrics**: The 14.2% reduction in false positive oncology alerts makes this suitable for secondary reader automated triaging.
- **Next Steps**: Benchmark Swin Transformer v2 against the original linear dot-product attention in our local radiological dataset.`,
    tags: ['Methodology', 'AI Architecture', 'Oncology', 'Implementation'],
    createdAt: '2026-07-21T10:15:00Z',
    updatedAt: '2026-07-21T11:20:00Z',
    isPinned: true,
    color: 'emerald'
  },
  {
    id: 'note-2',
    articleId: 'art-3',
    articleTitle: 'Fault-Tolerant Surface Codes on Scalable Superconducting Qubit Arrays',
    title: 'Error Suppression Threshold & Neural Network Decoder',
    content: `## Critical Milestone Analysis
The reduction of error rates from **1.2% down to 0.14%** with Distance-5 codes confirms that surface code error correction works in practice, not just in toy models.

### Real-Time Decoding Performance:
- Neural decoder latency: **850 ns**
- Max allowable loop speed: **1.0 μs** before qubit state decay occurs.
- *Question*: How easily can this DNN decoder scale when controlling 1,000+ logical qubits simultaneously?`,
    tags: ['Quantum', 'Error Correction', 'Hardware', 'Review'],
    createdAt: '2026-07-25T08:30:00Z',
    updatedAt: '2026-07-25T08:30:00Z',
    isPinned: true,
    color: 'indigo'
  },
  {
    id: 'note-3',
    title: 'Cross-Domain Literature Review: AI in Sustainable Energy & Grid Optimization',
    content: `# Synthesis Notes: Renewable Grid Control & Deep Learning

1. **Transformer Models in Load Forecasting**:
   - Applying self-attention mechanisms to multi-region grid sensors provides 15-minute lookahead predictions with under 1.8% error.
2. **Battery Degradation Prevention**:
   - Combining electrochemistry models with solid-state interface monitoring (Goodenough et al., 2025) extends pack longevity in grid storage facilities.
3. **Open Questions**:
   - Can fault-tolerant quantum algorithms optimize global energy grid routing in polynomial time?`,
    tags: ['Literature Review', 'Energy', 'AI Synthesis', 'Grid'],
    createdAt: '2026-07-25T14:10:00Z',
    updatedAt: '2026-07-25T15:00:00Z',
    isPinned: false,
    color: 'amber'
  }
];

export const INITIAL_ACTIVE_TASK: ResearchTask = {
  id: 'task-active-001',
  title: 'Multi-Modal AI & Biomarker Detection Literature Synthesis',
  queryTopic: 'Impact of Transformer Architectures and Attention Mechanisms on Multi-Modal Medical Diagnostics (2024-2026)',
  status: 'running',
  progress: 68,
  currentStep: 'Step 3/4: Synthesizing Comparative Analysis & Cross-Domain Implications',
  totalSteps: 4,
  startedAt: '2026-07-26T05:00:00Z',
  logs: [
    { timestamp: '05:00:02', message: 'Agent initialized. Querying OpenAlex & arXiv for high-impact 2024-2026 literature...', type: 'info' },
    { timestamp: '05:00:15', message: 'Retrieved 14 primary peer-reviewed articles matching query parameters.', type: 'success' },
    { timestamp: '05:00:32', message: 'Extracting methodological details, sample sizes, and quantitative benchmarks...', type: 'info' },
    { timestamp: '05:01:05', message: 'Running Gemini 3.6 Flash deep synthesis on self-attention vs convolutional backbones...', type: 'ai' },
    { timestamp: '05:01:40', message: 'Synthesizing key consensus points, limitations, and standardized BibTeX citations...', type: 'info' },
    { timestamp: '05:02:10', message: 'Cross-referencing biomarker sensitivity metrics across multi-site radiological trials...', type: 'ai' }
  ],
  synthesisResult: {
    overview: 'This active research synthesis analyzes recent developments in multi-modal vision transformers applied to early-onset biomarker detection. Across 14 reviewed papers, self-attention mechanisms consistently demonstrate superior performance over traditional 3D CNNs in capturing long-range dependencies in complex clinical datasets.',
    themes: [
      { theme: 'Diagnostic Accuracy & Latency', description: 'Self-attention yields an average 16.4% reduction in false positives across oncology screening while reducing fine-tuning compute requirements.', paperCount: 6 },
      { theme: 'Multi-Modal Fusion Strategies', description: 'Early fusion of genomics data with 3D MRI voxel embeddings improves biomarker alignment by 22% compared to late decision fusion.', paperCount: 5 },
      { theme: 'Interpretability & Clinical Trust', description: 'Attention heatmaps provide radiological validation, allowing clinicians to verify anatomical focus regions in real time.', paperCount: 3 }
    ],
    consensusPoints: [
      'Self-attention backbones outperform CNNs when trained on multi-site heterogeneous clinical scans.',
      'Linear attention variants (Swin-3D, Performer) are essential for 4K volumetric imaging due to quadratic memory bounds.',
      'Standardized BibTeX meta-data and benchmark protocol sharing significantly accelerate clinical translation.'
    ],
    debatesAndGaps: [
      'Debate remains regarding whether self-attention model interpretability maps are strictly causal or purely correlational.',
      'Lack of diverse multi-ethnic dataset evaluation in early 2024 trials warrants further validation.'
    ],
    extractedPaperTitles: [
      'Attention Is All You Need: Modern Transformers in Medical Vision and Diagnostics',
      'Multi-Modal Vision Transformers for Early Oncology Screening (2025)',
      'Linear Attention Approximations in High-Dimensional Radiomics (2026)'
    ]
  }
};
