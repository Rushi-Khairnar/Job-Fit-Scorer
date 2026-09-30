export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillTag: string;
}

export interface SkillQuiz {
  id: string;
  title: string;
  roleTag: string;
  iconName: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
}

export const QUIZ_COLLECTION: SkillQuiz[] = [
  {
    id: 'python-data-science',
    title: 'Python & Data Science Fundamentals',
    roleTag: 'Data Scientist / Analyst',
    iconName: 'BrainCircuit',
    level: 'Intermediate',
    description: 'Test your understanding of Pandas dataframes, NumPy vectors, and statistical analysis.',
    questions: [
      {
        id: 1,
        question: 'Which Pandas method is best suited to compute summary statistics (count, mean, std, percentiles) for numerical columns?',
        options: ['df.info()', 'df.describe()', 'df.summary()', 'df.aggregate()'],
        correctIndex: 1,
        explanation: 'df.describe() generates descriptive statistics that summarize the central tendency, dispersion, and shape of a dataset distribution.',
        skillTag: 'Pandas'
      },
      {
        id: 2,
        question: 'In NumPy, what is the term for how operations are performed on arrays of different shapes without copying data?',
        options: ['Broadcasting', 'Vector slicing', 'Dimension folding', 'Matrix concatenation'],
        correctIndex: 0,
        explanation: 'Broadcasting allows NumPy to treat arrays of different shapes during arithmetic operations without creating unnecessary copies in memory.',
        skillTag: 'Python'
      },
      {
        id: 3,
        question: 'What is the primary difference between a Series and a DataFrame in Pandas?',
        options: [
          'A Series is mutable, whereas a DataFrame is immutable',
          'A Series is a one-dimensional labeled array, while a DataFrame is a 2D tabular data structure',
          'A Series only accepts integers, whereas DataFrames accept text',
          'There is no difference; they are interchangeable'
        ],
        correctIndex: 1,
        explanation: 'A Pandas Series represents a single column (1D labeled data), whereas a DataFrame is a full 2D table composed of multiple Series sharing an index.',
        skillTag: 'Pandas'
      },
      {
        id: 4,
        question: 'Which of the following techniques is commonly used to address class imbalance in classification datasets?',
        options: ['SMOTE (Synthetic Minority Over-sampling)', 'L2 Ridge Regularization', 'Min-Max Scaling', 'One-Hot Encoding'],
        correctIndex: 0,
        explanation: 'SMOTE generates synthetic examples from the minority class by interpolating between neighboring samples, balancing the target classes.',
        skillTag: 'Machine Learning'
      },
      {
        id: 5,
        question: 'When should you use the median instead of the mean to represent central tendency?',
        options: [
          'When the data follows a perfect normal distribution',
          'When the dataset contains severe outliers or skewed distributions',
          'When working solely with categorical text data',
          'When the sample size exceeds 1,000,000 records'
        ],
        correctIndex: 1,
        explanation: 'The median is robust against extreme values (outliers) and skewed distributions, while the mean is pulled heavily toward outliers.',
        skillTag: 'Statistics'
      }
    ]
  },
  {
    id: 'sql-databases',
    title: 'SQL & Database Architecture',
    roleTag: 'Data Engineer / Backend',
    iconName: 'Database',
    level: 'Intermediate',
    description: 'Assess relational database querying, window functions, and indexing strategies.',
    questions: [
      {
        id: 1,
        question: 'What is the functional difference between WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters rows before aggregation, while HAVING filters after GROUP BY aggregations',
          'HAVING can only be used with primary keys',
          'WHERE is only valid in MySQL; HAVING is used in PostgreSQL',
          'There is no difference; both filter rows identically'
        ],
        correctIndex: 0,
        explanation: 'WHERE filters individual row records before grouping occurs, while HAVING filters aggregated metric results (like SUM, COUNT, AVG) after GROUP BY.',
        skillTag: 'SQL'
      },
      {
        id: 2,
        question: 'Which SQL JOIN type returns all records from the left table and only matching records from the right table?',
        options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'LEFT JOIN returns all rows from the left table; if no match exists in the right table, NULL values are populated for the right columns.',
        skillTag: 'SQL'
      },
      {
        id: 3,
        question: 'Which window function produces a rank without gaps for ties (e.g., 1, 2, 2, 3 instead of 1, 2, 2, 4)?',
        options: ['ROW_NUMBER()', 'DENSE_RANK()', 'RANK()', 'NTILE()'],
        correctIndex: 1,
        explanation: 'DENSE_RANK() assigns consecutive ranks to distinct values without skipping ranks after tied ranks, unlike RANK() which leaves gaps.',
        skillTag: 'SQL'
      },
      {
        id: 4,
        question: 'What type of database index is typically created on primary keys to store data rows sorted on disk?',
        options: ['Clustered Index', 'Non-Clustered Index', 'Bitmap Index', 'Hash Index'],
        correctIndex: 0,
        explanation: 'A Clustered Index determines the physical order of data inside the table file. A table can only have one clustered index.',
        skillTag: 'Databases'
      },
      {
        id: 5,
        question: 'What does the ACID acronym stand for in relational transactional database systems?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Completeness, Integrity, Dependability',
          'Access, Control, Indexing, Data',
          'Automation, Concurrency, Iteration, Distribution'
        ],
        correctIndex: 0,
        explanation: 'ACID guarantees that database transactions are processed reliably: Atomicity (all or nothing), Consistency, Isolation, and Durability.',
        skillTag: 'Databases'
      }
    ]
  },
  {
    id: 'web-react-frontend',
    title: 'Frontend & Modern React Mastery',
    roleTag: 'Frontend / Full Stack Engineer',
    iconName: 'Code',
    level: 'Intermediate',
    description: 'Evaluate React hooks, performance memoization, state management, and modern DOM concepts.',
    questions: [
      {
        id: 1,
        question: 'When should you use the useMemo hook in a React component?',
        options: [
          'To cache expensive calculation results across re-renders when dependencies have not changed',
          'To run asynchronous fetch side effects on mount',
          'To trigger a mandatory component re-render',
          'To store persistent mutable values without re-rendering'
        ],
        correctIndex: 0,
        explanation: 'useMemo memoizes the computed result of an expensive calculation, recalculating it only when one of its specified dependencies changes.',
        skillTag: 'React'
      },
      {
        id: 2,
        question: 'What is the main benefit of providing unique, stable "key" props to list items in React?',
        options: [
          'It applies custom CSS styling to each item',
          'It helps React reconciliation identify which items have changed, been added, or removed',
          'It prevents items from being selected by the user',
          'It automatically sorts array elements alphabetically'
        ],
        correctIndex: 1,
        explanation: 'Keys allow React to match virtual DOM children with existing DOM nodes during reconciliation, preventing unnecessary DOM re-creations.',
        skillTag: 'React'
      },
      {
        id: 3,
        question: 'In modern CSS, what does the Flexbox property "justify-content: space-between" do?',
        options: [
          'Centers all items vertically in the flex container',
          'Evenly distributes child items along the main axis with the first item at the start and the last item at the end',
          'Adds equal margins outside the outer boundaries of the container',
          'Wraps child items into multiple rows if they overflow'
        ],
        correctIndex: 1,
        explanation: 'space-between spreads items across the main axis with the first item flush against the start edge and the last item flush against the end edge.',
        skillTag: 'CSS'
      },
      {
        id: 4,
        question: 'Which TypeScript utility type constructs a type with all properties of T set to optional?',
        options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T, K>'],
        correctIndex: 1,
        explanation: 'Partial<T> returns a new type identical to T but with every property marked as optional (value | undefined).',
        skillTag: 'TypeScript'
      },
      {
        id: 5,
        question: 'What is the purpose of the useEffect cleanup function returned from the effect callback?',
        options: [
          'To reset component state variables to their initial definitions',
          'To clean up subscriptions, timers, or event listeners before the component unmounts or before re-running the effect',
          'To delete local storage keys after page refresh',
          'To close browser tabs automatically'
        ],
        correctIndex: 1,
        explanation: 'The return function inside useEffect runs right before the component unmounts or before the effect is re-executed, preventing memory leaks.',
        skillTag: 'React'
      }
    ]
  },
  {
    id: 'cloud-devops-docker',
    title: 'Cloud, Docker & DevOps Pipelines',
    roleTag: 'Cloud Architect / DevOps Engineer',
    iconName: 'Cloud',
    level: 'Advanced',
    description: 'Test containerization principles, CI/CD stages, Kubernetes pods, and cloud security.',
    questions: [
      {
        id: 1,
        question: 'What is the fundamental difference between a Docker Image and a Docker Container?',
        options: [
          'An image is a static, read-only template with instructions; a container is a running instance of an image',
          'An image runs on Windows, while containers only run on Linux',
          'Images require Kubernetes, while containers run independently',
          'There is no difference; they are synonyms in container technology'
        ],
        correctIndex: 0,
        explanation: 'A Docker image is an immutable blueprint containing the code, runtime, libraries, and environment; a container is the runnable execution layer.',
        skillTag: 'Docker'
      },
      {
        id: 2,
        question: 'In Kubernetes, what is the smallest deployable compute unit that can be created and managed?',
        options: ['Node', 'Pod', 'Cluster', 'Service'],
        correctIndex: 1,
        explanation: 'A Pod is the smallest execution unit in Kubernetes, representing a single instance of a running process consisting of one or more containers.',
        skillTag: 'Kubernetes'
      },
      {
        id: 3,
        question: 'Which principle states that cloud users should only receive the minimum permissions necessary to complete their job functions?',
        options: ['Principle of Least Privilege (PoLP)', 'Zero-Configuration Protocol', 'Single-Sign-On Mandate', 'Continuous Delivery Rule'],
        correctIndex: 0,
        explanation: 'Least Privilege (PoLP) ensures accounts and services possess only the essential privileges required for their authorized functions, minimizing attack surfaces.',
        skillTag: 'AWS'
      },
      {
        id: 4,
        question: 'What is the primary function of an Infrastructure as Code (IaC) tool like Terraform?',
        options: [
          'To compile Python code into machine language',
          'To provision, manage, and version cloud infrastructure declaratively using configuration files',
          'To serve HTML pages to mobile browsers',
          'To encrypt user passwords in database tables'
        ],
        correctIndex: 1,
        explanation: 'Terraform allows engineers to define cloud infrastructure declaratively in code, enabling automated provisioning, drift detection, and version control.',
        skillTag: 'Terraform'
      },
      {
        id: 5,
        question: 'In a CI/CD pipeline, what distinguishes Continuous Delivery from Continuous Deployment?',
        options: [
          'Continuous Delivery requires manual approval before deploying to production; Continuous Deployment deploys automatically',
          'Continuous Delivery is only for mobile apps; Continuous Deployment is for web servers',
          'Continuous Deployment never runs unit tests',
          'Continuous Delivery cannot use Docker containers'
        ],
        correctIndex: 0,
        explanation: 'Continuous Delivery prepares releases automatically but pauses for a human trigger to deploy to production, while Continuous Deployment ships directly without human intervention.',
        skillTag: 'CI/CD'
      }
    ]
  }
];
