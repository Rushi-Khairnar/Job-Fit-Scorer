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
  roadmapRole: string; // Direct link to JOB_DIRECTORY_DATA role
  questions: QuizQuestion[];
}

export const QUIZ_COLLECTION: SkillQuiz[] = [
  {
    id: 'python-data-science',
    title: 'Python Programming & Data Structures',
    roleTag: 'Data Scientist / Software Engineer',
    iconName: 'BrainCircuit',
    level: 'Intermediate',
    roadmapRole: 'Data Scientist',
    description: 'Test your understanding of Pandas dataframes, NumPy vectors, list comprehensions, and memory efficiency.',
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
        question: 'Which Python data structure provides O(1) average time complexity for element lookups and insertions?',
        options: ['list', 'tuple', 'dict / set', 'deque'],
        correctIndex: 2,
        explanation: 'Python dictionaries and sets are implemented as hash tables, delivering O(1) average complexity for key lookups and insertions.',
        skillTag: 'Python'
      },
      {
        id: 5,
        question: 'What is the purpose of the Python "yield" keyword inside a function?',
        options: [
          'It terminates the function and raises an exception',
          'It turns the function into a generator that produces values lazily without holding the entire collection in memory',
          'It forces multithreading across CPU cores',
          'It pauses the garbage collector'
        ],
        correctIndex: 1,
        explanation: 'The yield keyword produces a generator object, allowing iterative consumption of items one-by-one to conserve memory.',
        skillTag: 'Python'
      },
      {
        id: 6,
        question: 'In Pandas, which method should be used to avoid SettingWithCopyWarning when modifying a filtered slice of a DataFrame?',
        options: ['df.filter().copy()', 'df.loc[condition, column] = value', 'df.iloc().clone()', 'df.assign_now()'],
        correctIndex: 1,
        explanation: 'Using df.loc[row_indexer, col_indexer] = value explicitly accesses and mutates the underlying DataFrame without ambiguous chained indexing.',
        skillTag: 'Pandas'
      },
      {
        id: 7,
        question: 'What is the GIL (Global Interpreter Lock) in CPython?',
        options: [
          'A security sandbox that stops scripts from reading local disk',
          'A mutex that allows only one native thread to execute Python bytecode at a time',
          'A network firewall built into the Python socket library',
          'A compiler optimization that speeds up mathematical loops'
        ],
        correctIndex: 1,
        explanation: 'The CPython GIL ensures thread-safe memory management by allowing only one thread to execute Python bytecode simultaneously.',
        skillTag: 'Python'
      },
      {
        id: 8,
        question: 'Which method in NumPy calculates the matrix dot product of two 2D arrays?',
        options: ['np.add()', 'np.dot() or @ operator', 'np.cross()', 'np.element_prod()'],
        correctIndex: 1,
        explanation: 'np.dot(A, B) or the @ operator performs matrix multiplication in modern Python and NumPy.',
        skillTag: 'Python'
      },
      {
        id: 9,
        question: 'What does the functools.lru_cache decorator do in Python?',
        options: [
          'Logs execution time to a file',
          'Caches the return values of a function based on arguments using a Least Recently Used eviction strategy',
          'Converts standard functions into async coroutines',
          'Restricts function calls to authenticated users'
        ],
        correctIndex: 1,
        explanation: 'lru_cache memoizes function results, returning cached answers when identical arguments are passed to avoid repetitive expensive computations.',
        skillTag: 'Python'
      },
      {
        id: 10,
        question: 'In Pandas, what is the most performant way to iterate over rows when applying a custom calculation?',
        options: [
          'Standard for loop with df.iterrows()',
          'Vectorized operations or df.apply() / np.vectorize',
          'While loop using index increments',
          'df.to_dict() iteration'
        ],
        correctIndex: 1,
        explanation: 'Vectorized NumPy/Pandas operations execute in optimized C routines and are orders of magnitude faster than Python iterrows() loops.',
        skillTag: 'Pandas'
      }
    ]
  },
  {
    id: 'sql-databases',
    title: 'SQL, Relational Databases & Query Optimization',
    roleTag: 'Data Analyst / Backend Developer',
    iconName: 'Database',
    level: 'Intermediate',
    roadmapRole: 'Data Analyst',
    description: 'Master joins, window functions, indexing, and query execution plans for high-throughput databases.',
    questions: [
      {
        id: 1,
        question: 'What is the fundamental difference between the WHERE and HAVING clauses in SQL?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters aggregated groups created by GROUP BY',
          'HAVING only works on integer columns, whereas WHERE works on text',
          'WHERE is deprecated in SQL:2023',
          'HAVING runs before the FROM clause executes'
        ],
        correctIndex: 0,
        explanation: 'WHERE filters individual records prior to grouping, while HAVING applies filtering criteria after GROUP BY aggregation.',
        skillTag: 'SQL'
      },
      {
        id: 2,
        question: 'Which SQL window function assigns a rank to each row with no gaps in ranking values for ties?',
        options: ['RANK()', 'DENSE_RANK()', 'ROW_NUMBER()', 'NTILE()'],
        correctIndex: 1,
        explanation: 'DENSE_RANK() assigns consecutive rankings without gaps even when two or more rows tie on order criteria (e.g. 1, 2, 2, 3).',
        skillTag: 'SQL'
      },
      {
        id: 3,
        question: 'What kind of database index is structured as a balanced tree where leaf nodes contain pointers to physical table rows?',
        options: ['Hash Index', 'B-Tree Index', 'Bitmap Index', 'Spatial R-Tree'],
        correctIndex: 1,
        explanation: 'B-Tree (Balanced Tree) indexes are the default in relational systems like PostgreSQL and MySQL, supporting equality and range scans in O(log N) time.',
        skillTag: 'SQL'
      },
      {
        id: 4,
        question: 'What is a Common Table Expression (CTE) defined by?',
        options: ['The WITH keyword', 'The SUBQUERY keyword', 'The TEMPORARY TABLE directive', 'The VIEW schema'],
        correctIndex: 0,
        explanation: 'CTEs are defined using WITH query_name AS (...) and provide readable, modular temporary result sets within a single execution scope.',
        skillTag: 'SQL'
      },
      {
        id: 5,
        question: 'In an ACID-compliant database transaction, what does the "I" stand for?',
        options: ['Integrity', 'Isolation', 'Iteration', 'Indexing'],
        correctIndex: 1,
        explanation: 'Isolation ensures that concurrent transactions execute without interfering with one another, preventing dirty reads and phantom data.',
        skillTag: 'SQL'
      },
      {
        id: 6,
        question: 'When analyzing slow database queries, which command displays the physical execution steps chosen by the optimizer?',
        options: ['ANALYZE DATABASE', 'EXPLAIN ANALYZE', 'DEBUG QUERY', 'PROFILE RUNTIME'],
        correctIndex: 1,
        explanation: 'EXPLAIN ANALYZE shows the planned execution steps alongside actual execution times and row counts.',
        skillTag: 'SQL'
      },
      {
        id: 7,
        question: 'What is the effect of using UNION ALL instead of UNION between two queries?',
        options: [
          'UNION ALL removes duplicates while UNION keeps them',
          'UNION ALL preserves all duplicate records and executes faster by skipping the sorting/deduplication step',
          'UNION ALL only works on numerical columns',
          'UNION ALL converts results to JSON format'
        ],
        correctIndex: 1,
        explanation: 'UNION ALL concatenates datasets directly without sorting to remove duplicates, saving substantial CPU and memory.',
        skillTag: 'SQL'
      },
      {
        id: 8,
        question: 'What occurs during a database Deadlock?',
        options: [
          'A disk runs completely out of storage space',
          'Two transactions each hold a lock that the other needs, creating an unresolvable circular dependency',
          'An index becomes corrupt and needs rebuilding',
          'A foreign key constraint fails validation'
        ],
        correctIndex: 1,
        explanation: 'A deadlock occurs when two processes each hold a resource that the other requires to proceed, resolved by the engine aborting one transaction.',
        skillTag: 'SQL'
      },
      {
        id: 9,
        question: 'Which join type returns all rows from the left table and matched rows from the right, with NULLs for unmatched right rows?',
        options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
        correctIndex: 1,
        explanation: 'LEFT JOIN preserves every record from the left table regardless of whether a matching record exists in the right table.',
        skillTag: 'SQL'
      },
      {
        id: 10,
        question: 'What does database normalization to Third Normal Form (3NF) eliminate?',
        options: [
          'All foreign keys',
          'Transitive functional dependencies between non-key attributes',
          'All composite primary keys',
          'Index fragmentation'
        ],
        correctIndex: 1,
        explanation: '3NF ensures every non-key column depends only on the primary key, eliminating transitive dependencies and update anomalies.',
        skillTag: 'SQL'
      }
    ]
  },
  {
    id: 'frontend-react',
    title: 'Frontend Web Development (React & TypeScript)',
    roleTag: 'Frontend Developer / Full Stack',
    iconName: 'Layout',
    level: 'Intermediate',
    roadmapRole: 'Frontend Developer',
    description: 'Hooks lifecycle, state management, reconciliation, TypeScript types, and DOM performance.',
    questions: [
      {
        id: 1,
        question: 'In React 18, what is the primary benefit of the useTransition hook?',
        options: [
          'It animates CSS transforms on component mount',
          'It marks state updates as non-urgent transitions, allowing high-priority user inputs to interrupt rendering',
          'It handles server-side route transitions in Next.js',
          'It automatically debounces API fetch calls'
        ],
        correctIndex: 1,
        explanation: 'useTransition marks state updates as non-blocking transitions, keeping user interactions like typing responsive.',
        skillTag: 'React'
      },
      {
        id: 2,
        question: 'Why should you never use the array index as a key prop for dynamic lists in React?',
        options: [
          'React throws a runtime compile error when keys are numbers',
          'Reordering, inserting, or deleting items can cause incorrect component state to be preserved across renders',
          'Array keys decrease network download speed',
          'Keys must be cryptographic UUID strings'
        ],
        correctIndex: 1,
        explanation: 'Index keys break React identity tracking when lists change order or items are deleted, causing input states and DOM elements to mix up.',
        skillTag: 'React'
      },
      {
        id: 3,
        question: 'In TypeScript, what is the key difference between an "interface" and a "type" alias?',
        options: [
          'Interfaces can be reopened and merged via declaration merging; type aliases cannot',
          'Type aliases cannot represent object shapes',
          'Interfaces cannot be implemented by classes',
          'There is zero difference in the modern compiler'
        ],
        correctIndex: 0,
        explanation: 'Interfaces support declaration merging across modules, whereas type aliases are fixed once defined and support unions/primitives.',
        skillTag: 'TypeScript'
      },
      {
        id: 4,
        question: 'When should you reach for useCallback in React?',
        options: [
          'On every single callback function in your entire codebase',
          'When passing a callback to an optimized child component that relies on reference equality (React.memo)',
          'To run asynchronous fetch requests on page load',
          'To replace the useState hook'
        ],
        correctIndex: 1,
        explanation: 'useCallback caches function instances between renders so memoized child components do not re-render unnecessarily.',
        skillTag: 'React'
      },
      {
        id: 5,
        question: 'What is the purpose of the React useEffect cleanup function?',
        options: [
          'To garbage collect unused variables inside the hook',
          'To cancel network subscriptions, clear timers, or remove event listeners before the component unmounts or before re-running the effect',
          'To reset component state to initial defaults',
          'To delete DOM nodes manually'
        ],
        correctIndex: 1,
        explanation: 'Returning a cleanup function cleans up persistent subscriptions, intervals, or event handlers to prevent memory leaks.',
        skillTag: 'React'
      },
      {
        id: 6,
        question: 'In TypeScript, what does the "unknown" type represent compared to "any"?',
        options: [
          'unknown is identical to any with a different keyword',
          'unknown is a type-safe counterpart to any that requires explicit type narrowing or casting before operating on the value',
          'unknown can only hold null or undefined',
          'unknown disables TypeScript type checking entirely'
        ],
        correctIndex: 1,
        explanation: 'unknown enforces type safety by requiring you to perform type checks (e.g. typeof or instanceof) before using the variable.',
        skillTag: 'TypeScript'
      },
      {
        id: 7,
        question: 'What causes a React component to re-render?',
        options: [
          'Changes to its internal state, props received from parent, or context values it subscribes to',
          'Only when the window is resized',
          'Only when localStorage changes',
          'Any DOM scroll event anywhere on the page'
        ],
        correctIndex: 0,
        explanation: 'A component re-renders when its own state updates, its parent re-renders and passes new props, or a subscribed Context changes.',
        skillTag: 'React'
      },
      {
        id: 8,
        question: 'What is the Virtual DOM in React?',
        options: [
          'A browser extension required to run React',
          'A lightweight in-memory JavaScript representation of the real DOM tree used to calculate minimal required real DOM diffs',
          'A shadow DOM encapsulation for Web Components',
          'A server-side database cache'
        ],
        correctIndex: 1,
        explanation: 'The Virtual DOM allows React to calculate reconciliation diffs in JavaScript before executing expensive batched updates on the real DOM.',
        skillTag: 'React'
      },
      {
        id: 9,
        question: 'In CSS/Tailwind, what is the benefit of using CSS Grid over Flexbox for two-dimensional layouts?',
        options: [
          'Flexbox is deprecated in modern browsers',
          'CSS Grid controls both rows and columns simultaneously, while Flexbox is primarily one-dimensional (row OR column)',
          'CSS Grid uses less bandwidth',
          'Flexbox cannot center items'
        ],
        correctIndex: 1,
        explanation: 'Grid is designed for 2D layouts (rows and columns concurrently), whereas Flexbox is best for 1D flow alignment.',
        skillTag: 'CSS'
      },
      {
        id: 10,
        question: 'What does the TypeScript "Partial<T>" utility type do?',
        options: [
          'Deletes half of the properties from type T',
          'Constructs a type with all properties of T set to optional (?)',
          'Makes all properties of T readonly',
          'Extracts only the function methods of T'
        ],
        correctIndex: 1,
        explanation: 'Partial<T> transforms all properties of an interface or type into optional fields.',
        skillTag: 'TypeScript'
      }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Architecture & DevOps Engineering',
    roleTag: 'DevOps / Cloud Architect',
    iconName: 'Cloud',
    level: 'Advanced',
    roadmapRole: 'Cloud Architect',
    description: 'Infrastructure as Code, Kubernetes clusters, CI/CD pipelines, container security, and high availability.',
    questions: [
      {
        id: 1,
        question: 'In Kubernetes, what is the role of an Ingress Controller?',
        options: [
          'It manages internal node storage volumes',
          'It acts as an HTTP/HTTPS reverse proxy and load balancer routing external traffic to internal ClusterIP services',
          'It monitors CPU usage on worker nodes',
          'It builds Docker images automatically'
        ],
        correctIndex: 1,
        explanation: 'An Ingress controller provides application-layer (L7) routing, SSL termination, and host/path-based traffic distribution.',
        skillTag: 'Kubernetes'
      },
      {
        id: 2,
        question: 'In Terraform, what is the purpose of the remote state file (e.g. S3 with DynamoDB locking)?',
        options: [
          'It stores server logs for auditing',
          'It tracks the current real-world state of managed infrastructure and prevents concurrent race condition deployments',
          'It encrypts user passwords in cleartext',
          'It generates architectural diagrams automatically'
        ],
        correctIndex: 1,
        explanation: 'Remote state records mapped infrastructure resources, while state locking prevents multiple engineers from making conflicting updates.',
        skillTag: 'Terraform'
      },
      {
        id: 3,
        question: 'What is the primary difference between a Blue/Green deployment and a Canary deployment?',
        options: [
          'Blue/Green deploys to two identical production environments and flips traffic all at once; Canary routes a small percentage of traffic to the new version first',
          'Canary is only for databases; Blue/Green is for frontends',
          'Blue/Green requires Kubernetes; Canary requires Docker Swarm',
          'There is no difference; they are synonymous'
        ],
        correctIndex: 0,
        explanation: 'Blue/Green swaps 100% of traffic between parallel environments, whereas Canary routes a gradual fraction of users (e.g. 5%) to detect bugs safely.',
        skillTag: 'DevOps'
      },
      {
        id: 4,
        question: 'In AWS, which service provides serverless event-driven compute without provisioning EC2 instances?',
        options: ['AWS Lambda', 'AWS Elastic Beanstalk', 'Amazon Lightsail', 'Amazon Redshift'],
        correctIndex: 0,
        explanation: 'AWS Lambda runs code in response to events and automatically manages underlying compute resources with millisecond scaling.',
        skillTag: 'AWS'
      },
      {
        id: 5,
        question: 'What is the purpose of a Docker multi-stage build?',
        options: [
          'To run multiple containers inside a single image',
          'To separate compile-time build dependencies from the final lightweight production image, drastically reducing image size and attack surface',
          'To build across multiple operating systems simultaneously',
          'To bypass Docker daemon security checks'
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds leave compilers and build tooling behind, copying only the compiled artifacts into a minimal runtime image (e.g. alpine).',
        skillTag: 'Docker'
      },
      {
        id: 6,
        question: 'In Prometheus monitoring, what is the difference between a Counter and a Gauge metric?',
        options: [
          'A Counter can only increment (or reset to 0), while a Gauge can arbitrarily rise and fall',
          'Counters are used for percentages, Gauges for integers',
          'Gauges cannot be queried with PromQL',
          'Counters measure hardware temperatures only'
        ],
        correctIndex: 0,
        explanation: 'Counters represent cumulative counts (e.g. total requests served), while Gauges represent instantaneous values (e.g. memory usage or queue length).',
        skillTag: 'DevOps'
      },
      {
        id: 7,
        question: 'What does the "12-Factor App" methodology recommend regarding configuration settings?',
        options: [
          'Hardcode configurations directly into source code files',
          'Store configuration strictly in the environment variables (environment-specific)',
          'Store configurations in XML files committed to Git',
          'Store configurations in the browser localStorage'
        ],
        correctIndex: 1,
        explanation: 'Factor III mandates strict separation of config from code, reading environment-specific variables from the OS environment.',
        skillTag: 'DevOps'
      },
      {
        id: 8,
        question: 'In networking, what is the role of CIDR notation (e.g. 10.0.0.0/16)?',
        options: [
          'It defines the DNS server domain name',
          'It specifies an IP address block and subnet mask determining the range of usable host IP addresses',
          'It sets the SSL certificate expiration date',
          'It configures load balancer cookie persistence'
        ],
        correctIndex: 1,
        explanation: 'CIDR (Classless Inter-Domain Routing) defines the network prefix length, establishing subnet size and IP allocation capacity.',
        skillTag: 'Cloud'
      },
      {
        id: 9,
        question: 'What security model assumes zero trust even inside the corporate network boundary?',
        options: ['Perimeter Defense', 'Zero Trust Architecture', 'DMZ Bastion', 'Open Source Security'],
        correctIndex: 1,
        explanation: 'Zero Trust requires continuous verification, least-privilege access, and encryption for every request, regardless of origin.',
        skillTag: 'Cloud'
      },
      {
        id: 10,
        question: 'Which tool automates continuous delivery by synchronizing Git repositories with Kubernetes clusters (GitOps)?',
        options: ['ArgoCD or Flux', 'Docker Compose', 'Nginx', 'Vagrant'],
        correctIndex: 0,
        explanation: 'ArgoCD and Flux implement GitOps, using Git as the single source of truth and automatically reconciling cluster state.',
        skillTag: 'Kubernetes'
      }
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning & Predictive Modeling',
    roleTag: 'Data Scientist / ML Engineer',
    iconName: 'Cpu',
    level: 'Advanced',
    roadmapRole: 'Machine Learning Engineer',
    description: 'Loss functions, cross-validation, regularization, neural architectures, and model evaluation metrics.',
    questions: [
      {
        id: 1,
        question: 'When evaluating a disease diagnostic model where missing a sick patient has catastrophic consequences, which metric should be maximized?',
        options: ['Precision', 'Recall (Sensitivity)', 'Accuracy', 'Specificity'],
        correctIndex: 1,
        explanation: 'Recall (TP / (TP + FN)) minimizes False Negatives, ensuring that actual positive cases are rarely missed.',
        skillTag: 'Machine Learning'
      },
      {
        id: 2,
        question: 'What is the primary difference between L1 (Lasso) and L2 (Ridge) regularization?',
        options: [
          'L1 adds the absolute value of weights to the loss and can drive feature coefficients to exactly zero (feature selection); L2 penalizes squared weights and shrinks them toward zero',
          'L2 can set coefficients to zero, while L1 cannot',
          'L1 is only used in unsupervised learning',
          'L2 cannot be used with gradient descent'
        ],
        correctIndex: 0,
        explanation: 'L1 regularization induces sparsity by zeroing out non-informative feature weights, functioning as built-in feature selection.',
        skillTag: 'Machine Learning'
      },
      {
        id: 3,
        question: 'What problem does the Attention Mechanism in Transformers fundamentally solve compared to recurrent neural networks (RNNs)?',
        options: [
          'It eliminates the need for any training data',
          'It processes all tokens in parallel and models long-range dependencies directly without information degradation over sequential steps',
          'It removes the need for GPUs',
          'It guarantees 100% training accuracy'
        ],
        correctIndex: 1,
        explanation: 'Self-attention computes direct token-to-token relationship weights in parallel, overcoming the vanishing gradient bottleneck of sequential RNNs.',
        skillTag: 'Deep Learning'
      },
      {
        id: 4,
        question: 'What is Data Leakage in a machine learning pipeline?',
        options: [
          'When sensitive customer records are hacked',
          'When information from the test/target dataset inadvertently contaminates the training set, causing deceptively high offline validation scores that fail in production',
          'When memory leaks crash the Python interpreter',
          'When features contain too many missing values'
        ],
        correctIndex: 1,
        explanation: 'Data leakage happens when features containing future or target information are included during training, causing false confidence.',
        skillTag: 'Machine Learning'
      },
      {
        id: 5,
        question: 'In gradient boosted decision trees (GBDT) like XGBoost and LightGBM, how are subsequent trees constructed?',
        options: [
          'Each tree is trained independently on random subsets of the data (bagging)',
          'Each new tree is trained to predict the residual errors (pseudo-residuals) of the previous ensemble of trees',
          'Trees are trained backwards from the leaf nodes',
          'Trees only use single-feature threshold splits'
        ],
        correctIndex: 1,
        explanation: 'Boosting sequentially adds trees, with each new model fitting the negative gradient of the loss function (the residual errors).',
        skillTag: 'Machine Learning'
      },
      {
        id: 6,
        question: 'What is the purpose of SHAP (SHapley Additive exPlanations) values in modern MLOps?',
        options: [
          'To compress neural networks for mobile deployment',
          'To provide mathematically grounded game-theoretic feature attributions explaining individual model predictions',
          'To generate synthetic training data',
          'To format SQL queries'
        ],
        correctIndex: 1,
        explanation: 'SHAP computes the marginal contribution of each feature to a prediction, providing clear model interpretability.',
        skillTag: 'Machine Learning'
      },
      {
        id: 7,
        question: 'What does the ROC-AUC score measure?',
        options: [
          'The exact monetary return on investment of a model',
          'A classifier’s ability to rank positive instances higher than negative instances across all possible classification probability thresholds',
          'The training loss convergence rate',
          'The number of CPU cycles consumed during inference'
        ],
        correctIndex: 1,
        explanation: 'ROC-AUC measures discrimination capability independently of threshold choice, where 1.0 is perfect separation and 0.5 is random chance.',
        skillTag: 'Machine Learning'
      },
      {
        id: 8,
        question: 'What is the function of Dropout in training deep neural networks?',
        options: [
          'It drops corrupted rows from the training set',
          'It randomly deactivates a fraction of neurons during training passes to prevent co-adaptation and reduce overfitting',
          'It decreases the learning rate after every epoch',
          'It terminates training when validation loss stops improving'
        ],
        correctIndex: 1,
        explanation: 'Dropout forces the network to learn robust redundant representations by randomly zeroing out neuron activations during training.',
        skillTag: 'Deep Learning'
      },
      {
        id: 9,
        question: 'Which clustering algorithm does NOT require you to specify the number of clusters (K) in advance?',
        options: ['K-Means', 'DBSCAN', 'MiniBatch K-Means', 'Gaussian Mixture Models with fixed components'],
        correctIndex: 1,
        explanation: 'DBSCAN clusters data based on spatial density and neighborhood distances, discovering arbitrary cluster counts and detecting outliers as noise.',
        skillTag: 'Machine Learning'
      },
      {
        id: 10,
        question: 'What is Concept Drift in production machine learning?',
        options: [
          'When hardware memory corrupts model weights',
          'When the statistical relationship between input features X and the target label Y changes over time',
          'When code comments do not match the algorithm',
          'When a dataset contains too many outliers'
        ],
        correctIndex: 1,
        explanation: 'Concept drift occurs when underlying real-world dynamics change (e.g. consumer fraud patterns shift), requiring scheduled model retraining.',
        skillTag: 'Machine Learning'
      }
    ]
  },
  {
    id: 'system-design',
    title: 'System Design & Distributed Architecture',
    roleTag: 'Full Stack / Backend Engineer',
    iconName: 'Server',
    level: 'Advanced',
    roadmapRole: 'Backend Developer',
    description: 'Scalability, CAP theorem, caching strategies, messaging queues, rate limiting, and sharding.',
    questions: [
      {
        id: 1,
        question: 'According to the CAP Theorem, what can a distributed data store guarantee during a network partition (P)?',
        options: [
          'Both Consistency (C) and Availability (A) simultaneously',
          'Either Consistency (CP) OR Availability (AP), but not both at the same time',
          'Neither Consistency nor Availability',
          'Infinite scalability without latency'
        ],
        correctIndex: 1,
        explanation: 'When network partitions occur, distributed systems must trade off between returning the most recent write (Consistency) or accepting reads/writes regardless of synchronization (Availability).',
        skillTag: 'System Design'
      },
      {
        id: 2,
        question: 'What is the purpose of Consistent Hashing in distributed caching rings (like Memcached or DynamoDB)?',
        options: [
          'To encrypt user passwords across nodes',
          'To minimize key re-mapping when cache nodes are added or removed, preventing catastrophic cache misses',
          'To compress string keys into 32-bit integers',
          'To sort database records alphabetically'
        ],
        correctIndex: 1,
        explanation: 'Consistent hashing places keys and nodes on an abstract hash ring so that adding/removing a server only remaps O(K/N) keys instead of all keys.',
        skillTag: 'System Design'
      },
      {
        id: 3,
        question: 'Which caching strategy writes data directly to the cache and the backing database simultaneously before confirming success?',
        options: ['Cache-Aside (Lazy Loading)', 'Write-Through', 'Write-Behind (Write-Back)', 'Refresh-Ahead'],
        correctIndex: 1,
        explanation: 'Write-Through writes to both cache and DB synchronously, ensuring cache consistency at the expense of higher write latency.',
        skillTag: 'System Design'
      },
      {
        id: 4,
        question: 'What algorithm is commonly used for API Rate Limiting to handle sudden bursty traffic while enforcing an average rate over time?',
        options: ['Token Bucket', 'Binary Search', 'Dijkstra’s Algorithm', 'Quicksort'],
        correctIndex: 0,
        explanation: 'The Token Bucket algorithm accumulates tokens at a steady rate and consumes them per request, accommodating temporary traffic bursts smoothly.',
        skillTag: 'System Design'
      },
      {
        id: 5,
        question: 'What problem does a Message Queue (like Apache Kafka or RabbitMQ) solve between microservices?',
        options: [
          'It replaces relational database primary keys',
          'It decouples producer and consumer services, absorbs traffic spikes (load leveling), and enables asynchronous event processing',
          'It serves static HTML files to browser clients',
          'It compiles TypeScript code in the background'
        ],
        correctIndex: 1,
        explanation: 'Message brokers decouple producer and consumer services, allowing systems to buffer high load and process tasks asynchronously.',
        skillTag: 'System Design'
      },
      {
        id: 6,
        question: 'What is Database Sharding?',
        options: [
          'Backing up database tables to tape drives',
          'Horizontally partitioning rows across multiple independent physical database instances based on a shard key',
          'Compressing database indexes into zip files',
          'Encrypting table columns with TLS'
        ],
        correctIndex: 1,
        explanation: 'Sharding distributes data across separate server nodes using a partition key to scale storage and write throughput beyond a single machine.',
        skillTag: 'System Design'
      },
      {
        id: 7,
        question: 'In high-scale web architectures, what is a CDN (Content Delivery Network) primarily used for?',
        options: [
          'Running background machine learning training jobs',
          'Caching static and media assets at geographically distributed edge locations close to end-users to reduce latency and origin server load',
          'Managing user login passwords',
          'Managing database transaction rollbacks'
        ],
        correctIndex: 1,
        explanation: 'CDNs cache assets at edge locations worldwide, drastically cutting time-to-first-byte (TTFB) and protecting backend origin servers.',
        skillTag: 'System Design'
      },
      {
        id: 8,
        question: 'What is the purpose of the Circuit Breaker pattern in microservice communications?',
        options: [
          'To restart the physical power supply of a server rack',
          'To detect repeated service failures and fail fast without overwhelming a degraded downstream dependency, allowing it time to recover',
          'To encrypt RPC payloads with AES-256',
          'To round-robin DNS records'
        ],
        correctIndex: 1,
        explanation: 'A circuit breaker trips open when downstream failures cross a threshold, returning immediate fallbacks and preventing cascading outages.',
        skillTag: 'System Design'
      },
      {
        id: 9,
        question: 'What is an Idempotent API operation?',
        options: [
          'An operation that only runs in dark mode',
          'An operation where making multiple identical requests has the exact same side-effect on the system state as making a single request',
          'An operation that requires zero authentication',
          'An operation that returns data in XML format'
        ],
        correctIndex: 1,
        explanation: 'Idempotent operations (such as HTTP PUT or payment requests with unique idempotency keys) can be safely retried without duplicate side effects.',
        skillTag: 'System Design'
      },
      {
        id: 10,
        question: 'What is the primary trade-off when selecting an Eventual Consistency model for distributed data?',
        options: [
          'You trade instant read consistency across all nodes for higher availability, lower latency, and partition tolerance',
          'Data is permanently lost after 24 hours',
          'Queries can only be written in Python',
          'Indexes cannot be created'
        ],
        correctIndex: 0,
        explanation: 'Eventual consistency guarantees that all replicas will converge given sufficient time, enabling high availability and throughput.',
        skillTag: 'System Design'
      }
    ]
  },
  {
    id: 'cyber-security',
    title: 'Cybersecurity, Secure Coding & Network Defense',
    roleTag: 'Cybersecurity Analyst / SRE',
    iconName: 'ShieldCheck',
    level: 'Intermediate',
    roadmapRole: 'Cyber Security Analyst',
    description: 'OWASP top 10, cryptography, authentication tokens, zero-day mitigation, and identity management.',
    questions: [
      {
        id: 1,
        question: 'What is the most effective defense against SQL Injection vulnerabilities in backend web applications?',
        options: [
          'Client-side JavaScript input trimming',
          'Parameterized queries (Prepared Statements) or ORM abstraction',
          'Running SQL queries as the root database user',
          'Hiding the database port number'
        ],
        correctIndex: 1,
        explanation: 'Prepared statements treat user input strictly as parameters rather than executable SQL code, preventing command injection.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 2,
        question: 'What is the purpose of the "HttpOnly" flag on an authentication session cookie?',
        options: [
          'It forces the cookie to only work over unencrypted HTTP',
          'It blocks client-side scripts (JavaScript) from accessing document.cookie, mitigating session hijacking via Cross-Site Scripting (XSS)',
          'It compresses cookie size for mobile networks',
          'It expires the cookie after 60 seconds'
        ],
        correctIndex: 1,
        explanation: 'HttpOnly prevents malicious JavaScript injected via XSS attacks from reading or stealing session authentication tokens.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 3,
        question: 'What is the fundamental difference between Symmetric and Asymmetric encryption?',
        options: [
          'Symmetric uses the same key for encryption and decryption; Asymmetric uses a public key to encrypt and a private key to decrypt',
          'Symmetric is only used for passwords, Asymmetric for files',
          'Asymmetric encryption is 10,000x faster than Symmetric',
          'Symmetric encryption does not require keys'
        ],
        correctIndex: 0,
        explanation: 'Symmetric encryption (e.g. AES) uses a single shared secret, while Asymmetric (e.g. RSA, ECC) uses mathematically linked keypairs.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 4,
        question: 'What does a Cross-Site Request Forgery (CSRF) attack exploit?',
        options: [
          'A server operating system vulnerability',
          'A web browser automatically sending stored authentication cookies with unauthorized requests initiated by a malicious third-party site',
          'Weak Wi-Fi encryption protocols',
          'SQL database index corruption'
        ],
        correctIndex: 1,
        explanation: 'CSRF tricks an authenticated browser into submitting unauthorized transactions to a vulnerable web app using existing cookies.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 5,
        question: 'Which HTTP security header helps prevent Clickjacking attacks by controlling whether a site can be rendered inside an <iframe>?',
        options: ['X-Frame-Options or Content-Security-Policy (frame-ancestors)', 'X-Powered-By', 'Access-Control-Allow-Origin', 'Server-Timing'],
        correctIndex: 0,
        explanation: 'X-Frame-Options: DENY or CSP frame-ancestors prevents malicious websites from overlaying invisible iframes to steal clicks.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 6,
        question: 'Why should passwords NEVER be stored using plain MD5 or SHA-256 hashes?',
        options: [
          'They take up too much disk space',
          'They are computationally too fast, making them highly vulnerable to GPU-accelerated brute-force attacks and precomputed Rainbow Tables',
          'They cannot store numbers',
          'They expire automatically after 30 days'
        ],
        correctIndex: 1,
        explanation: 'Modern GPUs can compute billions of SHA-256 hashes per second. Passwords require salted, computationally slow key derivation functions like bcrypt or Argon2id.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 7,
        question: 'What is the purpose of Cross-Origin Resource Sharing (CORS) in web browsers?',
        options: [
          'A server-side mechanism to stop DDoS attacks',
          'A browser security mechanism that restricts web pages from making AJAX requests to a different domain unless the target server explicitly permits it',
          'A protocol for encrypting WebSockets',
          'A compression algorithm for JSON payloads'
        ],
        correctIndex: 1,
        explanation: 'CORS is a browser-enforced security policy that governs cross-origin HTTP requests using Access-Control-Allow-* headers.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 8,
        question: 'What is the Principle of Least Privilege (PoLP)?',
        options: [
          'Users and system processes should only be granted the minimum necessary permissions required to perform their valid job functions',
          'Developers should write minimal documentation',
          'Servers should run with minimal RAM',
          'All employees should share the root admin password'
        ],
        correctIndex: 0,
        explanation: 'Least Privilege minimizes blast radius by restricting access rights strictly to what is required for authorized operations.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 9,
        question: 'What is a "Man-in-the-Middle" (MitM) attack prevented by?',
        options: [
          'Bilateral Transport Layer Security (TLS/HTTPS) with validated certificates',
          'Removing CSS stylesheets',
          'Using dark mode themes',
          'Increasing CPU clock speed'
        ],
        correctIndex: 0,
        explanation: 'TLS encrypts and cryptographically signs network traffic, ensuring confidentiality and integrity against eavesdropping.',
        skillTag: 'Cybersecurity'
      },
      {
        id: 10,
        question: 'In identity management, what does MFA (Multi-Factor Authentication) require?',
        options: [
          'Two different passwords typed twice',
          'Authentication using at least two different factor categories: something you know, something you have, or something you are',
          'Signing in from two different browsers simultaneously',
          'Entering both your work and personal email'
        ],
        correctIndex: 1,
        explanation: 'MFA requires credentials from distinct factor categories: knowledge (password), possession (hardware key/app token), or inherence (biometrics).',
        skillTag: 'Cybersecurity'
      }
    ]
  },
  {
    id: 'docker-k8s',
    title: 'Docker Containers & Kubernetes Orchestration',
    roleTag: 'DevOps / Cloud Engineer',
    iconName: 'Boxes',
    level: 'Advanced',
    roadmapRole: 'DevOps Engineer',
    description: 'Container runtimes, pod networking, Helm charts, configmaps, and persistent storage.',
    questions: [
      {
        id: 1,
        question: 'What Linux kernel primitives form the foundational isolation mechanisms of Docker containers?',
        options: [
          'Namespaces (for resource isolation) and Cgroups (for resource limitation)',
          'VirtualBox hypervisors and BIOS emulators',
          'Systemd timers and cron jobs',
          'X11 window managers and ALSA sound drivers'
        ],
        correctIndex: 0,
        explanation: 'Namespaces isolate processes, network stacks, and mount points; control groups (cgroups) meter and limit CPU and memory usage.',
        skillTag: 'Docker'
      },
      {
        id: 2,
        question: 'What is the smallest deployable computing unit in Kubernetes?',
        options: ['A Node', 'A Pod', 'A Cluster', 'A Container Image'],
        correctIndex: 1,
        explanation: 'A Pod wraps one or more co-located containers that share the same network namespace, IP address, and storage volumes.',
        skillTag: 'Kubernetes'
      },
      {
        id: 3,
        question: 'What is the difference between a Liveness Probe and a Readiness Probe in Kubernetes?',
        options: [
          'A Liveness Probe determines if a container should be restarted; a Readiness Probe determines if the Pod is ready to receive network traffic from a Service',
          'Readiness probes delete pods permanently; Liveness probes pause CPU',
          'Liveness probes check memory; Readiness probes check disk size',
          'There is no functional difference'
        ],
        correctIndex: 0,
        explanation: 'Liveness restarts failed or deadlocked containers; Readiness pulls unready pods out of Service load balancer endpoints.',
        skillTag: 'Kubernetes'
      },
      {
        id: 4,
        question: 'Which Kubernetes resource maintains a continuous desired count of identical Pod replicas and handles rolling updates?',
        options: ['ConfigMap', 'Deployment', 'Secret', 'Ingress'],
        correctIndex: 1,
        explanation: 'A Deployment manages underlying ReplicaSets, orchestrating declarative rolling upgrades and rollbacks without downtime.',
        skillTag: 'Kubernetes'
      },
      {
        id: 5,
        question: 'In Docker, what is the layer caching mechanism during "docker build"?',
        options: [
          'Each command in a Dockerfile creates a read-only filesystem layer; unchanged commands reuse cached layers from prior builds',
          'Docker stores all images in cloud RAM',
          'Layers are only cached if the host has 64GB of RAM',
          'Docker rebuilds every layer from scratch on every run'
        ],
        correctIndex: 0,
        explanation: 'Docker caches image layers sequentially. Placing rarely changing steps (like installing system packages) before COPY . speeds up builds.',
        skillTag: 'Docker'
      },
      {
        id: 6,
        question: 'What Kubernetes resource is used to run a pod on every single worker node in the cluster (e.g. for log collection or node monitoring)?',
        options: ['DaemonSet', 'StatefulSet', 'Job', 'CronJob'],
        correctIndex: 0,
        explanation: 'DaemonSets ensure that all (or some) nodes run a copy of a pod, ideal for cluster-wide logging (Fluentd) and metrics agents (node-exporter).',
        skillTag: 'Kubernetes'
      },
      {
        id: 7,
        question: 'How do pods within the same Kubernetes cluster discover other services by name?',
        options: [
          'Via CoreDNS, which resolves service names (e.g. "my-db.default.svc.cluster.local") to cluster IP addresses',
          'Through manual IP configuration files',
          'Using broadcast ARP pings over Wi-Fi',
          'By reading browser history'
        ],
        correctIndex: 0,
        explanation: 'Kubernetes runs internal cluster DNS (CoreDNS) that registers Service endpoints and translates domain names to internal virtual IPs.',
        skillTag: 'Kubernetes'
      },
      {
        id: 8,
        question: 'What is Helm in the Kubernetes ecosystem?',
        options: [
          'A physical steering wheel for server racks',
          'A package manager and templating engine that packages Kubernetes manifests into versioned, configurable releases (Charts)',
          'A database replication protocol',
          'A container runtime replacing containerd'
        ],
        correctIndex: 1,
        explanation: 'Helm is the de-facto package manager for Kubernetes, using Charts to parameterize and deploy complex multi-resource applications.',
        skillTag: 'Kubernetes'
      },
      {
        id: 9,
        question: 'What is the purpose of a Kubernetes StatefulSet compared to a standard Deployment?',
        options: [
          'StatefulSets provide stable unique network identifiers (e.g. pod-0, pod-1), ordered deployment/scaling, and dedicated persistent storage for clustered databases',
          'StatefulSets only run stateless web servers',
          'StatefulSets do not support persistent volumes',
          'StatefulSets cannot be updated'
        ],
        correctIndex: 0,
        explanation: 'StatefulSets maintain persistent identities, deterministic startup order, and sticky storage for databases like Cassandra, Kafka, or PostgreSQL.',
        skillTag: 'Kubernetes'
      },
      {
        id: 10,
        question: 'In Docker, what command removes all stopped containers, unused networks, and dangling build cache images?',
        options: ['docker system prune', 'docker delete all', 'docker wipe-clean', 'docker reset'],
        correctIndex: 0,
        explanation: 'docker system prune cleans up unused container artifacts, freeing substantial disk space on development and CI/CD worker hosts.',
        skillTag: 'Docker'
      }
    ]
  },
  {
    id: 'modern-javascript',
    title: 'Modern JavaScript & Web Performance',
    roleTag: 'Frontend / Full Stack Developer',
    iconName: 'Code2',
    level: 'Intermediate',
    roadmapRole: 'Full Stack Developer',
    description: 'Event loop, promises, closures, async/await, memory leaks, and DOM rendering pipelines.',
    questions: [
      {
        id: 1,
        question: 'In the JavaScript runtime event loop, which queue has execution priority over the task (macro-task) queue?',
        options: [
          'Microtask queue (Promise callbacks, queueMicrotask)',
          'setTimeout callback queue',
          'setInterval callback queue',
          'DOM event listeners queue'
        ],
        correctIndex: 0,
        explanation: 'Microtasks (like Promise.then and process.nextTick) are drained completely at the end of every execution frame before the next macrotask runs.',
        skillTag: 'JavaScript'
      },
      {
        id: 2,
        question: 'What is a Closure in JavaScript?',
        options: [
          'A keyword that shuts down the node process',
          'A function bundled together with references to its surrounding lexical environment, allowing it to access variables from its outer scope even after the outer function has returned',
          'A method to close browser tabs',
          'A syntax error thrown by JSON.parse'
        ],
        correctIndex: 1,
        explanation: 'Closures give inner functions access to outer function variables by preserving the lexical scope chain in memory.',
        skillTag: 'JavaScript'
      },
      {
        id: 3,
        question: 'What does Promise.all() do when any single one of its input promises rejects?',
        options: [
          'It waits for all others to finish before rejecting',
          'It rejects immediately with the reason of the first promise that rejected, ignoring any remaining pending promises',
          'It converts the rejected promise into a resolved null',
          'It retries the failed promise 3 times'
        ],
        correctIndex: 1,
        explanation: 'Promise.all() has fail-fast behavior: if any promise rejects, the entire returned promise rejects immediately.',
        skillTag: 'JavaScript'
      },
      {
        id: 4,
        question: 'If you want multiple promises to settle regardless of whether they resolve or reject, which method should you use?',
        options: ['Promise.race()', 'Promise.allSettled()', 'Promise.any()', 'Promise.settleAll()'],
        correctIndex: 1,
        explanation: 'Promise.allSettled() waits for all promises to settle and returns an array of objects describing each outcome (status and value or reason).',
        skillTag: 'JavaScript'
      },
      {
        id: 5,
        question: 'What is the purpose of the JavaScript WeakMap data structure?',
        options: [
          'To store weak cryptographic hashes',
          'To hold key-value pairs where keys must be objects and are held weakly, allowing them to be garbage collected when no other references exist',
          'To store arrays of numbers',
          'To simulate slow network connections'
        ],
        correctIndex: 1,
        explanation: 'WeakMap prevents memory leaks by allowing keys (objects) to be garbage collected without maintaining strong memory references.',
        skillTag: 'JavaScript'
      },
      {
        id: 6,
        question: 'What is the difference between "==" and "===" in JavaScript?',
        options: [
          '== performs type coercion before comparison; === is strict equality requiring both value and type to match without conversion',
          '=== is deprecated in ES2024',
          '== compares memory addresses; === compares strings',
          'There is no functional difference'
        ],
        correctIndex: 0,
        explanation: 'Strict equality (===) checks both value and type without performing implicit type coercion, avoiding subtle bugs like "" == 0.',
        skillTag: 'JavaScript'
      },
      {
        id: 7,
        question: 'What is Event Bubbling in the browser DOM?',
        options: [
          'A CSS animation effect',
          'The propagation phase where an event triggers on the innermost target element and then bubbles up through its ancestors in the DOM tree',
          'When memory leaks crash the tab',
          'When audio plays in background tabs'
        ],
        correctIndex: 1,
        explanation: 'Events bubble upward from target element to document root, enabling event delegation where a single parent listener handles child events.',
        skillTag: 'JavaScript'
      },
      {
        id: 8,
        question: 'Which method creates a deep clone of a plain JavaScript object without third-party libraries in modern browsers?',
        options: ['structuredClone(obj)', 'Object.assign({}, obj)', '{ ...obj }', 'obj.cloneDeep()'],
        correctIndex: 0,
        explanation: 'structuredClone() is the native browser standard for deep cloning objects, preserving nested structures, Dates, and Maps.',
        skillTag: 'JavaScript'
      },
      {
        id: 9,
        question: 'What is the purpose of window.requestAnimationFrame()?',
        options: [
          'To download animated GIF files',
          'To schedule a callback function to run right before the browser’s next repaint, ensuring smooth 60fps/120fps animations synchronized with display refresh',
          'To pause JavaScript execution for 1 second',
          'To record video from the webcam'
        ],
        correctIndex: 1,
        explanation: 'requestAnimationFrame synchronizes animation updates with the monitor refresh rate to prevent screen tearing and layout jank.',
        skillTag: 'JavaScript'
      },
      {
        id: 10,
        question: 'What is the Core Web Vitals metric INP (Interaction to Next Paint) measuring?',
        options: [
          'How fast images download from the server',
          'The overall responsiveness of a page by measuring the latency of all user interactions (clicks, taps, keypresses) throughout the entire session lifecycle',
          'The length of the HTML document',
          'The battery consumption of the device'
        ],
        correctIndex: 1,
        explanation: 'INP evaluates responsiveness by assessing the delay between a user interaction and the next visual frame rendered on screen.',
        skillTag: 'Web Performance'
      }
    ]
  },
  {
    id: 'data-analysis',
    title: 'Data Science & Exploratory Analytics',
    roleTag: 'Data Analyst / BI Specialist',
    iconName: 'PieChart',
    level: 'Intermediate',
    roadmapRole: 'Data Analyst',
    description: 'Statistical significance, A/B testing, data visualization, cohort analysis, and ETL pipelines.',
    questions: [
      {
        id: 1,
        question: 'In statistical hypothesis testing, what does a p-value of 0.03 indicate when testing at alpha = 0.05?',
        options: [
          'There is a 3% probability that the alternative hypothesis is true',
          'Assuming the null hypothesis is true, there is a 3% probability of observing results as extreme as the sample data; therefore, we reject the null hypothesis',
          'The model has 97% accuracy',
          'The test was conducted on 300 users'
        ],
        correctIndex: 1,
        explanation: 'A p-value below the significance threshold (0.03 < 0.05) provides statistically significant evidence to reject the null hypothesis.',
        skillTag: 'Statistics'
      },
      {
        id: 2,
        question: 'What is the primary danger of stopping an online A/B test early as soon as it reaches p < 0.05 (peeking problem)?',
        options: [
          'It costs too much money to analyze',
          'It severely inflates the False Positive rate (Type I error) due to repeated significance testing on random fluctuations',
          'It deletes test data from the database',
          'The sample size becomes too large'
        ],
        correctIndex: 1,
        explanation: 'Repeatedly testing for significance before pre-determined sample size is reached drastically inflates false discovery rates.',
        skillTag: 'A/B Testing'
      },
      {
        id: 3,
        question: 'What is the difference between Correlation and Causation?',
        options: [
          'They are identical statistical terms',
          'Correlation measures statistical association between variables; Causation establishes that changes in one variable directly produce changes in another',
          'Correlation is only for linear models; Causation is for neural nets',
          'Causation only applies in medical trials'
        ],
        correctIndex: 1,
        explanation: 'Correlation shows co-movement, but confounding variables or reverse causality may mean one does not cause the other.',
        skillTag: 'Statistics'
      },
      {
        id: 4,
        question: 'In data visualization, why are 3D pie charts widely discouraged by professional data analysts?',
        options: [
          'They cannot be rendered in modern web browsers',
          '3D perspective distortion makes it difficult for the human eye to accurately judge angles and relative area proportions',
          'They require GPU ray-tracing',
          'Pie charts only support two categories'
        ],
        correctIndex: 1,
        explanation: '3D perspective distorts segment sizes, making foreground slices appear deceptively larger than background slices.',
        skillTag: 'Data Visualization'
      },
      {
        id: 5,
        question: 'What is Cohort Analysis commonly used for in product and customer analytics?',
        options: [
          'Tracking retention, churn, and behavioral lifetime value of user groups sharing a common acquisition date over time',
          'Sorting database tables alphabetically',
          'Encrypting customer credit card records',
          'Calculating server CPU temperatures'
        ],
        correctIndex: 0,
        explanation: 'Cohort analysis groups users by sign-up month or milestone to isolate feature adoption and retention curves over time.',
        skillTag: 'Analytics'
      },
      {
        id: 6,
        question: 'What does the Central Limit Theorem state?',
        options: [
          'All datasets must follow a normal distribution',
          'The distribution of sample means approximates a normal distribution as sample size becomes large, regardless of the underlying population distribution shape',
          'Machines become slower as more data is collected',
          'A/B tests must run for exactly 30 days'
        ],
        correctIndex: 1,
        explanation: 'The Central Limit Theorem guarantees that the sampling distribution of the mean is approximately normal for large n (typically n >= 30).',
        skillTag: 'Statistics'
      },
      {
        id: 7,
        question: 'What is Simpson’s Paradox in statistical analysis?',
        options: [
          'When animated charts run out of memory',
          'A phenomenon where a trend appears in several groups of data, but disappears or reverses when the groups are combined',
          'When sample variance equals zero',
          'When correlation equals exactly 1.0'
        ],
        correctIndex: 1,
        explanation: 'Simpson’s paradox occurs when an unobserved confounding variable distorts aggregate results compared to subgroup stratifications.',
        skillTag: 'Statistics'
      },
      {
        id: 8,
        question: 'In an ETL pipeline, what does the "T" stand for?',
        options: ['Testing', 'Transform', 'Timing', 'Tokenize'],
        correctIndex: 1,
        explanation: 'Extract, Transform, Load (ETL) extracts raw data, transforms it through cleaning and aggregations, and loads it into a destination warehouse.',
        skillTag: 'Data Engineering'
      },
      {
        id: 9,
        question: 'Which metric measures the middle value of a dataset and is resilient against extreme outliers?',
        options: ['Mean', 'Median', 'Mode', 'Standard Deviation'],
        correctIndex: 1,
        explanation: 'The median divides the ordered distribution in half and is unaffected by extreme skewness or severe outliers, unlike the mean.',
        skillTag: 'Statistics'
      },
      {
        id: 10,
        question: 'What is Customer Churn Rate?',
        options: [
          'The speed at which the database performs write queries',
          'The percentage of subscribers or customers who cancel or discontinue their relationship over a specified timeframe',
          'The total marketing ad spend per month',
          'The server uptime percentage'
        ],
        correctIndex: 1,
        explanation: 'Churn rate measures the velocity at which customers leave a product or service, a critical indicator of retention and product health.',
        skillTag: 'Analytics'
      }
    ]
  }
];
