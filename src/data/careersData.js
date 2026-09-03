export const CAREERS_DATA = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    description: 'Builds, maintains, and tests stand-alone or system-level applications using general programming languages.',
    difficulty: 'Intermediate',
    requiredSkills: ['Java', 'C++', 'Git', 'SQL'],
    recommendedSkills: ['Python', 'HTML/CSS', 'Docker'],
    interests: ['Web Development', 'Mobile App Development'],
    strengths: ['Problem Solving', 'Analytical Thinking'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'MCA', 'M.Tech'],
    branches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
    typicalRoles: ['Software Engineer', 'Application Developer', 'Backend Engineer'],
    estLearningTime: '6 - 9 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Data Structures & Algorithms', 'Object-Oriented Programming (Java/C++)', 'Git Version Control'],
        skills: ['Debugging', 'Code Styling', 'Git Workflows'],
        practice: 'Solve 50+ basic array/string coding challenges on LeetCode/HackerRank.',
        resources: 'Coursera OOP in Java, freeCodeCamp Git Tutorial'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-6)',
        topics: ['Database Design (SQL)', 'Software Engineering Principles (SOLID)', 'Multithreading & Concurrency'],
        skills: ['SQL Queries', 'Refactoring', 'Unit Testing'],
        practice: 'Create a desktop app with database integration and write unit tests.',
        resources: 'Pragmatic Programmer book, Codecademy SQL Course'
      },
      advanced: {
        title: 'Advanced Phase (Month 7-12)',
        topics: ['System Design & Architecture', 'CI/CD Pipelines & Docker', 'Cloud Basics (AWS/Azure)'],
        skills: ['Microservices', 'Dockerizing Apps', 'APIs Security'],
        practice: 'Build a containerized API service deployed on AWS Free Tier.',
        resources: 'Designing Data-Intensive Applications book'
      }
    },
    projects: [
      {
        title: 'Dynamic Task Planner',
        difficulty: 'Beginner',
        technologies: ['Java', 'SQLite'],
        skillsGained: ['OOP Concepts', 'JDBC Integration', 'UI Layouts'],
        description: 'A desktop application to organize schedules, track milestones, and query historic completion logs.',
        outcome: 'A desktop task management interface with local database storage.'
      },
      {
        title: 'Multiplayer Chat Server',
        difficulty: 'Intermediate',
        technologies: ['C++', 'Sockets', 'Multithreading'],
        skillsGained: ['Network Sockets', 'Concurrency Control', 'Client-Server Arch'],
        description: 'A terminal-based chat client-server program that manages concurrent users via a custom message protocol.',
        outcome: 'A real-time terminal chat server that handles 10+ simultaneous client sessions.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'Explain the difference between an Abstract Class and an Interface in Java.',
        answerGuidance: 'Abstract classes can have concrete methods, variables, and states, allowing single inheritance. Interfaces define a contract (static final variables, abstract/default methods) allowing multiple inheritance.',
        difficulty: 'Intermediate',
        topic: 'OOP Concepts'
      },
      {
        category: 'Technical',
        question: 'What is the difference between a process and a thread?',
        answerGuidance: 'A process is an executing program instance with its own memory space. A thread is the smallest execution unit within a process, sharing memory space with other threads in the same process.',
        difficulty: 'Intermediate',
        topic: 'Operating Systems'
      },
      {
        category: 'Behavioral',
        question: 'Describe a time you had to debug a complex problem under a tight deadline.',
        answerGuidance: 'Focus on your structured approach: replicating the issue, analyzing log traces, writing regression tests, and how you communicated the status to your team.',
        difficulty: 'Beginner',
        topic: 'Problem Solving'
      }
    ]
  },
  {
    id: 'full-stack-developer',
    name: 'Full Stack Developer',
    description: 'Designs both front-end client layouts and back-end server architectures for web platforms.',
    difficulty: 'Intermediate',
    requiredSkills: ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'SQL', 'Git'],
    recommendedSkills: ['Docker', 'AWS', 'Python'],
    interests: ['Web Development', 'UI/UX Design'],
    strengths: ['Creativity', 'Problem Solving', 'Attention to Detail'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'MCA', 'M.Tech'],
    branches: ['Computer Science', 'Information Technology', 'Other'],
    typicalRoles: ['Full Stack Engineer', 'Frontend Engineer', 'Backend Developer'],
    estLearningTime: '8 - 12 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['HTML5 & CSS3 Responsive Layouts', 'Modern JavaScript (ES6+)', 'Git & Collaborative Web Code'],
        skills: ['Responsive Design', 'DOM Manipulation', 'Git commits'],
        practice: 'Clone 3 static website landing pages using raw HTML/CSS/JS.',
        resources: 'MDN Web Docs, freeCodeCamp Responsive Web Design'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-6)',
        topics: ['React Components & Hooks', 'Node.js & Express API Development', 'Relational & NoSQL Databases (SQL/MongoDB)'],
        skills: ['React State', 'REST APIs', 'CRUD Operations'],
        practice: 'Create a full-stack e-commerce dashboard or blogging platform.',
        resources: 'Full Stack Open (University of Helsinki)'
      },
      advanced: {
        title: 'Advanced Phase (Month 7-12)',
        topics: ['State Management (Redux/Zustand)', 'Web Security (JWT, CORS, OAuth)', 'CI/CD & Serverless Deployment (Vercel/Docker)'],
        skills: ['Authorization', 'Caching', 'Cloud Deployment'],
        practice: 'Deploy a containerized application to Render or Vercel with live database connections.',
        resources: 'Egghead.io, Frontend Masters courses'
      }
    },
    projects: [
      {
        title: 'Personal Finance Tracker',
        difficulty: 'Intermediate',
        technologies: ['React', 'Node.js', 'Express', 'SQL'],
        skillsGained: ['REST API Design', 'State Management', 'Relational Schemas'],
        description: 'A budgeting tracker letting users catalog expenses, create categories, and view visual analytics charts.',
        outcome: 'A deployed dashboard displaying expense categorization charts and transactional tables.'
      },
      {
        title: 'Real-time Collaborative Whiteboard',
        difficulty: 'Advanced',
        technologies: ['React', 'Node.js', 'Socket.io', 'Canvas API'],
        skillsGained: ['WebSockets', 'Canvas drawing sync', 'State conflicts resolution'],
        description: 'A canvas whiteboard letting multiple users draw simultaneously, sync strokes, and clear sessions.',
        outcome: 'A real-time synchronized canvas utility running on Heroku/Render.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'What is CORS and why is it enforced?',
        answerGuidance: 'Cross-Origin Resource Sharing is a security mechanism enforced by browsers to prevent scripts from requesting resources from a domain different from the one that served the script, unless configured.',
        difficulty: 'Intermediate',
        topic: 'Web Security'
      },
      {
        category: 'Technical',
        question: 'Explain the Virtual DOM in React and how it boosts rendering performance.',
        answerGuidance: 'React maintains a lightweight representation of the DOM in memory. On state changes, it compares the new Virtual DOM with the old one (diffing) and batch updates only the changed elements in the real DOM (reconciliation).',
        difficulty: 'Intermediate',
        topic: 'React'
      },
      {
        category: 'HR',
        question: 'Why do you prefer Full Stack development over specializing strictly in frontend or backend?',
        answerGuidance: 'Emphasize your passion for seeing the entire lifecycle of an application, from user interaction down to server data mapping, and how it helps you build cohesive designs.',
        difficulty: 'Beginner',
        topic: 'Aspirations'
      }
    ]
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Inspects, cleans, and models structural datasets to identify trends and generate business intelligence reports.',
    difficulty: 'Beginner',
    requiredSkills: ['SQL', 'Python', 'Git'],
    recommendedSkills: ['AWS', 'Java'],
    interests: ['Data Analytics'],
    strengths: ['Analytical Thinking', 'Attention to Detail'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'MCA', 'B.Sc', 'M.Sc'],
    branches: ['Computer Science', 'Information Technology', 'Data Science', 'Other'],
    typicalRoles: ['Business Intelligence Analyst', 'Data Specialist', 'Reporting Engineer'],
    estLearningTime: '3 - 6 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-2)',
        topics: ['Data Literacy & Excel Formulas', 'Introduction to SQL Queries', 'Data Visualization basics'],
        skills: ['SQL Joins', 'Pivot Tables', 'Basic Charts'],
        practice: 'Write SQL queries to join and filter transaction datasets on Kaggle.',
        resources: 'Google Data Analytics Professional Certificate'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 3-4)',
        topics: ['Python Data Stack (Pandas, NumPy)', 'Data Cleaning & Transformation', 'BI Dashboard Tools (Power BI / Tableau)'],
        skills: ['Jupyter Notebooks', 'ETL processes', 'Dashboard Design'],
        practice: 'Build an interactive Power BI dashboard tracking sales revenue metrics.',
        resources: 'Pandas documentation, Tableau Public Tutorials'
      },
      advanced: {
        title: 'Advanced Phase (Month 5-6)',
        topics: ['Descriptive Statistics', 'A/B Testing Concepts', 'Introduction to Big Data SQL (BigQuery/Snowflake)'],
        skills: ['Hypothesis Testing', 'Cloud Data Warehouses', 'Reporting Automation'],
        practice: 'Analyze a public web traffic dataset to run mock A/B testing calculations.',
        resources: 'StatQuest with Josh Starmer YouTube Channel'
      }
    },
    projects: [
      {
        title: 'COVID-19 Global Trends Tracker',
        difficulty: 'Beginner',
        technologies: ['SQL', 'Tableau'],
        skillsGained: ['Data Aggregation', 'Dashboard Design', 'Data Storytelling'],
        description: 'Clean raw worldwide cases data and compile interactive choropleth maps showing progression rates.',
        outcome: 'A published Tableau dashboard mapping cases, recoveries, and infection rates globally.'
      },
      {
        title: 'E-commerce Customer Segment Analytics',
        difficulty: 'Intermediate',
        technologies: ['Python', 'Pandas', 'Matplotlib'],
        skillsGained: ['Data Wrangling', 'Cohort Analysis', 'User Segmentation'],
        description: 'Clean raw transaction files, remove duplicates, calculate user cohort retention rates, and identify high-value customer clusters.',
        outcome: 'A Jupyter notebook showcasing cohort heatmaps and user retention graphs.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'Explain the difference between LEFT JOIN, RIGHT JOIN, and INNER JOIN in SQL.',
        answerGuidance: 'INNER JOIN returns records with matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right. RIGHT JOIN is the inverse of LEFT JOIN.',
        difficulty: 'Beginner',
        topic: 'SQL Databases'
      },
      {
        category: 'Technical',
        question: 'What is data normalization and why is it important in analytical databases?',
        answerGuidance: 'Data normalization structures tables to reduce redundancy and maintain integrity. However, analytical databases often use denormalized structures (star schemas) to speed up complex queries.',
        difficulty: 'Intermediate',
        topic: 'Database Design'
      },
      {
        category: 'Scenario-based',
        question: 'A manager claims that user engagement went up by 50% based on two days of data. How would you review this?',
        answerGuidance: 'Explain that two days is statistically insignificant. You would check sample size, weekly patterns, variance, anomalies, and perform hypothesis testing to determine statistical significance.',
        difficulty: 'Intermediate',
        topic: 'Data Interpretation'
      }
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Implements mathematical modeling, predictive pipelines, and statistics to solve complex data challenges.',
    difficulty: 'Advanced',
    requiredSkills: ['Python', 'SQL', 'Git'],
    recommendedSkills: ['Java', 'Docker', 'AWS'],
    interests: ['Data Analytics', 'Machine Learning & AI'],
    strengths: ['Analytical Thinking', 'Problem Solving'],
    degrees: ['B.Tech', 'B.E.', 'MCA', 'M.Tech', 'M.Sc'],
    branches: ['Computer Science', 'Data Science', 'AI/ML'],
    typicalRoles: ['Data Scientist', 'Quantitative Researcher', 'Predictive Analyst'],
    estLearningTime: '9 - 15 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Statistical Mathematics (Linear Algebra, Calculus)', 'Python Programming & Pandas', 'Advanced SQL Scripting'],
        skills: ['Matrix algebra', 'Exploratory Data Analysis', 'SQL CTEs'],
        practice: 'Clean and explore 5+ datasets from Kaggle using Python.',
        resources: 'Kahn Academy Linear Algebra, Python Data Science Handbook'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-8)',
        topics: ['Classical Machine Learning (Scikit-Learn)', 'Feature Engineering & Selection', 'Supervised vs Unsupervised Math'],
        skills: ['Linear Regression', 'Decision Trees', 'Model Evaluation metrics'],
        practice: 'Develop house price prediction models and evaluate using RMSE/MAE.',
        resources: 'Introduction to Statistical Learning (ISLR)'
      },
      advanced: {
        title: 'Advanced Phase (Month 9-15)',
        topics: ['Deep Learning & Neural Networks (TensorFlow/PyTorch)', 'Natural Language Processing or Computer Vision', 'Data MLOps (Model Deployment)'],
        skills: ['CNNs/RNNs', 'Tokenization', 'API Model Hosting'],
        practice: 'Build and deploy a text classifier API to predict news article categories.',
        resources: 'Deep Learning book (Goodfellow et al.)'
      }
    },
    projects: [
      {
        title: 'Telco Churn Prediction Pipeline',
        difficulty: 'Intermediate',
        technologies: ['Python', 'Scikit-Learn', 'Pandas'],
        skillsGained: ['Feature Scaling', 'Logistic Regression', 'ROC/AUC evaluation'],
        description: 'An end-to-end classification pipeline to identify customers at risk of cancellation based on demographic profiles.',
        outcome: 'A model scoring 85%+ AUC with feature importance charts.'
      },
      {
        title: 'Stock Market Forecasting Engine',
        difficulty: 'Advanced',
        technologies: ['Python', 'Keras', 'LSTM Networks', 'APIs'],
        skillsGained: ['Time-series Forecasting', 'Deep Learning', 'Data Pipelines'],
        description: 'Collect historical stock data and feed it to a Long Short-Term Memory network to predict short-term stock swings.',
        outcome: 'A trained LSTM forecasting model visualizing predictions vs actual outcomes.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'What is overfitting and how can you prevent it?',
        answerGuidance: 'Overfitting occurs when a model learns noise in the training data, degrading test set performance. Prevent it using cross-validation, regularization (L1/L2), pruning, dropout, or gathering more data.',
        difficulty: 'Intermediate',
        topic: 'Machine Learning'
      },
      {
        category: 'Technical',
        question: 'Explain the difference between L1 and L2 regularization.',
        answerGuidance: 'L1 (Lasso) adds absolute value of coefficients as penalty, driving unimportant feature weights to zero. L2 (Ridge) adds squared value of coefficients, shrinking weights but keeping them non-zero.',
        difficulty: 'Advanced',
        topic: 'Regularization'
      },
      {
        category: 'HR',
        question: 'How do you explain a complex machine learning model to non-technical business stakeholders?',
        answerGuidance: 'Focus on business metrics and outcomes instead of formulas. Use analogies, focus on input features and predictions, and explain how the model decisions drive profit or save time.',
        difficulty: 'Intermediate',
        topic: 'Communication'
      }
    ]
  },
  {
    id: 'ai-ml-engineer',
    name: 'AI/ML Engineer',
    description: 'Designs, trains, deploys, and optimizes scalable Artificial Intelligence models and neural architectures.',
    difficulty: 'Advanced',
    requiredSkills: ['Python', 'Git', 'Docker'],
    recommendedSkills: ['SQL', 'C++', 'AWS'],
    interests: ['Machine Learning & AI'],
    strengths: ['Problem Solving', 'Analytical Thinking'],
    degrees: ['B.Tech', 'B.E.', 'M.Tech', 'MCA', 'M.Sc'],
    branches: ['Computer Science', 'Data Science', 'AI/ML'],
    typicalRoles: ['Machine Learning Engineer', 'AI Developer', 'NLP Specialist'],
    estLearningTime: '10 - 18 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Mathematical Basics (Probability & Statistics)', 'Python ML Libraries (NumPy, SciPy)', 'Linear Classifiers'],
        skills: ['Vector calculation', 'Data Manipulation', 'Git versioning'],
        practice: 'Build linear regression models from scratch without using Scikit-Learn.',
        resources: 'Stanford CS229 lecture notes, Kaggle Learn'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-8)',
        topics: ['Deep Learning frameworks (PyTorch/TensorFlow)', 'Convolutional Neural Networks (CNNs)', 'Optimization Algorithms (Adam, SGD)'],
        skills: ['Backpropagation', 'Model Tuning', 'Tensor Operations'],
        practice: 'Develop a custom CNN to classify handwritten digits or image categories.',
        resources: 'CS231n: Convolutional Neural Networks for Visual Recognition'
      },
      advanced: {
        title: 'Advanced Phase (Month 9-18)',
        topics: ['Large Language Models & Transformers', 'ML Infrastructure (Kubernetes, MLflow)', 'Edge AI & Optimization (TensorRT)'],
        skills: ['Fine-tuning LLMs', 'Containerized ML APIs', 'Model Quantization'],
        practice: 'Fine-tune a small LLM (e.g. Llama-3-8B) on custom datasets and package it inside a Docker container.',
        resources: 'Hugging Face Course, PyTorch documentation'
      }
    },
    projects: [
      {
        title: 'Image-Based Medical Diagnostic tool',
        difficulty: 'Intermediate',
        technologies: ['Python', 'PyTorch', 'CNN'],
        skillsGained: ['Transfer Learning', 'Image augmentation', 'Confusion Matrix evaluation'],
        description: 'An image classification application utilizing ResNet weights to categorize chest X-rays for pneumonia symptoms.',
        outcome: 'A classification model achieving 92%+ validation accuracy.'
      },
      {
        title: 'Semantic Document Search Engine',
        difficulty: 'Advanced',
        technologies: ['Python', 'SentenceTransformers', 'FAISS', 'FastAPI'],
        skillsGained: ['Vector Embeddings', 'Approximate Nearest Neighbor search', 'API Design'],
        description: 'Translate raw text documents into vector embeddings, index them via FAISS, and query them with semantic similarity search.',
        outcome: 'A functional API returning top matching documents under 50ms.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'Explain the architecture of the Transformer model and the role of Self-Attention.',
        answerGuidance: 'The Transformer relies on encoder-decoder blocks using multi-head self-attention. Self-attention allows tokens to compute representation scores dynamically against all other tokens in a sequence, enabling parallelization.',
        difficulty: 'Advanced',
        topic: 'Transformers'
      },
      {
        category: 'Technical',
        question: 'What is gradient vanishing and how do modern architectures address it?',
        answerGuidance: 'Gradient vanishing occurs in deep networks where backpropagated gradients shrink exponentially, preventing early layers from updating. Fixed using ResNets (skip connections), ReLU activation, or batch normalization.',
        difficulty: 'Advanced',
        topic: 'Deep Learning'
      },
      {
        category: 'Scenario-based',
        question: 'Your model performs at 98% accuracy in training but only 65% in production. What is happening and how do you fix it?',
        answerGuidance: 'This is data leakage or covariate shift (concept drift). Review if target variables leaked into training, if production data distribution matches training data, and implement real-world dataset validation.',
        difficulty: 'Advanced',
        topic: 'Model Debugging'
      }
    ]
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Secures networks, cloud architectures, and databases against unauthorized breaches or vulnerabilities.',
    difficulty: 'Intermediate',
    requiredSkills: ['SQL', 'Git', 'Python'],
    recommendedSkills: ['Java', 'Docker'],
    interests: ['Cybersecurity', 'Cloud Computing & DevOps'],
    strengths: ['Analytical Thinking', 'Attention to Detail'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'MCA'],
    branches: ['Computer Science', 'Information Technology', 'Other'],
    typicalRoles: ['Information Security Analyst', 'SOC Analyst', 'Penetration Tester'],
    estLearningTime: '5 - 9 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Networking Fundamentals (TCP/IP, DNS)', 'Linux Administration & Command Line', 'Introduction to Security principles'],
        skills: ['Shell scripting', 'IP Subnetting', 'Network Scanning (Nmap)'],
        practice: 'Set up a local Linux virtual machine and secure SSH access configurations.',
        resources: 'CompTIA Security+ Guide, OverTheWire (Linux exercises)'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-6)',
        topics: ['Cryptography (AES, RSA, Hashing)', 'Web Application Security (OWASP Top 10)', 'Log Analysis & SIEM Tools'],
        skills: ['Exploit assessment', 'SQL Injection detection', 'Wireshark packet analysis'],
        practice: 'Identify web vulnerabilities in deliberate test targets like WebGoat or DVWA.',
        resources: 'OWASP Top 10 documentation, PortSwigger Web Security Academy'
      },
      advanced: {
        title: 'Advanced Phase (Month 7-9)',
        topics: ['Penetration Testing methodologies', 'Incident Response & Threat Hunting', 'Cloud Security (IAM, VPC flow logs)'],
        skills: ['Ethical Hacking', 'Digital Forensics', 'Security Auditing'],
        practice: 'Compete in 10+ Capture the Flag (CTF) challenges on TryHackMe or HackTheBox.',
        resources: 'Certified Ethical Hacker (CEH) syllabus, TryHackMe labs'
      }
    },
    projects: [
      {
        title: 'Automated Port Scanner & Vulnerability Detector',
        difficulty: 'Beginner',
        technologies: ['Python', 'Socket library'],
        skillsGained: ['Network Programming', 'Vulnerability Assessment', 'Scripting'],
        description: 'A Python script that scans custom target IPs, identifies open ports, and flags outdated service banners.',
        outcome: 'A terminal tool outputting service versions and security alerts.'
      },
      {
        title: 'Intrusion Detection System Parser',
        difficulty: 'Intermediate',
        technologies: ['Python', 'Regular Expressions', 'SQL'],
        skillsGained: ['Log Parsing', 'SQL Database logging', 'Alert configuration'],
        description: 'Monitor server auth logs, parse failed SSH attempts, and flag IPs executing brute-force patterns.',
        outcome: 'An automated shell script generating email alerts for suspicious log frequencies.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'Explain the difference between Symmetric and Asymmetric Encryption.',
        answerGuidance: 'Symmetric encryption uses a single shared secret key for encryption and decryption. Asymmetric encryption uses a mathematically linked key pair: a public key for encryption and a private key for decryption.',
        difficulty: 'Beginner',
        topic: 'Cryptography'
      },
      {
        category: 'Technical',
        question: 'What is a SQL Injection vulnerability and how do you mitigate it?',
        answerGuidance: 'SQL Injection occurs when user input is concatenated directly into SQL query strings, letting attackers execute arbitrary commands. Mitigate using prepared statements (parameterized queries) or ORMs.',
        difficulty: 'Intermediate',
        topic: 'Application Security'
      },
      {
        category: 'Scenario-based',
        question: 'You notice a massive spike in outbound traffic on port 443 at 3:00 AM. What are your immediate triage steps?',
        answerGuidance: 'First, isolate the source host from the network. Second, capture traffic packets for analysis. Third, check server process logs to identify which executable initiated the socket, and locate file modifications.',
        difficulty: 'Advanced',
        topic: 'Incident Response'
      }
    ]
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    description: 'Implements, maintains, and configures cloud-native applications and serverless resources.',
    difficulty: 'Intermediate',
    requiredSkills: ['AWS', 'Git', 'Docker'],
    recommendedSkills: ['Python', 'SQL', 'JavaScript'],
    interests: ['Cloud Computing & DevOps'],
    strengths: ['Problem Solving', 'Analytical Thinking'],
    degrees: ['B.Tech', 'B.E.', 'MCA', 'M.Tech'],
    branches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
    typicalRoles: ['Cloud Architect', 'AWS Systems Operator', 'Infrastructure Engineer'],
    estLearningTime: '6 - 10 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Virtualization basics', 'Linux OS commands', 'Core Cloud services (Compute, Storage, Network)'],
        skills: ['EC2 hosting', 'S3 storage policies', 'Linux Shell'],
        practice: 'Deploy a static landing page using AWS S3 and configure CloudFront.',
        resources: 'AWS Cloud Practitioner course material'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-7)',
        topics: ['Infrastructure as Code (Terraform)', 'Containerization (Docker)', 'Virtual Private Clouds (VPC) & Subnets'],
        skills: ['Writing Dockerfiles', 'Terraform plans', 'VPC route tables'],
        practice: 'Write Terraform scripts to spin up a load-balanced auto-scaling group of web servers.',
        resources: 'Terraform Up & Running book, Docker Tutorial'
      },
      advanced: {
        title: 'Advanced Phase (Month 8-10)',
        topics: ['Serverless Computing (Lambda, API Gateway)', 'Cloud Security IAM Policies', 'Container Orchestration (Kubernetes)'],
        skills: ['Lambda functions', 'IAM Least Privilege', 'Kubernetes clusters'],
        practice: 'Deploy a multi-tier microservice backend using AWS ECS or Kubernetes.',
        resources: 'AWS Solutions Architect Associate path'
      }
    },
    projects: [
      {
        title: 'Serverless Image Resizer API',
        difficulty: 'Intermediate',
        technologies: ['AWS S3', 'AWS Lambda', 'Python', 'API Gateway'],
        skillsGained: ['Event-driven Arch', 'AWS SDK (Boto3)', 'API Configuration'],
        description: 'When an image upload triggers an S3 event, fire a Python Lambda to resize the photo and save to a thumbnail bucket.',
        outcome: 'A fully serverless backend resizing images automatically on upload.'
      },
      {
        title: 'Infrastructure Deployment via Terraform',
        difficulty: 'Advanced',
        technologies: ['Terraform', 'Docker', 'AWS VPC', 'EC2'],
        skillsGained: ['IaC declarative files', 'AWS networking', 'Container hosting'],
        description: 'Develop a Terraform script to create a secure VPC with private and public subnets, launching dockerized nodes behind an Application Load Balancer.',
        outcome: 'Reusable Terraform configuration files deployed via a single terminal command.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'What is Infrastructure as Code (IaC) and what are its benefits?',
        answerGuidance: 'IaC manages and provisions computer data centers through machine-readable definition files rather than physical configuration. Benefits include consistency, speed, version-control integration, and reproducibility.',
        difficulty: 'Intermediate',
        topic: 'DevOps'
      },
      {
        category: 'Technical',
        question: 'Explain the difference between a public subnet and a private subnet in a VPC.',
        answerGuidance: 'A public subnet has a route table directing traffic to an Internet Gateway, allowing external network communication. A private subnet does not route directly to the Internet Gateway, requiring a NAT Gateway for outbound traffic.',
        difficulty: 'Intermediate',
        topic: 'Cloud Networking'
      },
      {
        category: 'Scenario-based',
        question: 'An S3 bucket containing customer receipts was left open to the public. How do you remediate and prevent this?',
        answerGuidance: 'Immediately enable Block Public Access settings on the bucket. Review bucket policies and IAM configurations to verify access limits. Implement AWS Config rules to monitor and alert public bucket creation.',
        difficulty: 'Intermediate',
        topic: 'Cloud Security'
      }
    ]
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Manages continuous deployment pipelines, automated software integration, and server orchestration.',
    difficulty: 'Advanced',
    requiredSkills: ['Git', 'Docker', 'AWS'],
    recommendedSkills: ['Python', 'SQL', 'Java'],
    interests: ['Cloud Computing & DevOps'],
    strengths: ['Problem Solving', 'Analytical Thinking'],
    degrees: ['B.Tech', 'B.E.', 'MCA', 'M.Tech'],
    branches: ['Computer Science', 'Information Technology'],
    typicalRoles: ['Site Reliability Engineer', 'CI/CD Specialist', 'Build Engineer'],
    estLearningTime: '7 - 12 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Linux Scripting (Bash)', 'Git Branching & Flow', 'Core Virtualization & Docker'],
        skills: ['Shell scripts', 'Rebasing/Branching', 'Docker containers'],
        practice: 'Write a bash script to monitor CPU usage and write summaries to daily log files.',
        resources: 'Linux Command Line book, Docker Docs'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-7)',
        topics: ['Continuous Integration Systems (GitHub Actions / Jenkins)', 'Artifact Repositories', 'Infrastructure Provisioning (Terraform)'],
        skills: ['YAML configs', 'Build workflows', 'Terraform state management'],
        practice: 'Create a GitHub Actions workflow that runs test suites automatically on every pull request.',
        resources: 'GitHub Actions documentation'
      },
      advanced: {
        title: 'Advanced Phase (Month 8-12)',
        topics: ['Container Orchestration (Kubernetes)', 'System Monitoring & Alerting (Prometheus, Grafana)', 'Configuration Management (Ansible)'],
        skills: ['K8s manifests', 'Metrics dashboards', 'Playbooks writing'],
        practice: 'Deploy a Kubernetes cluster running web server replicas monitored by Prometheus.',
        resources: 'Kubernetes Up & Running book'
      }
    },
    projects: [
      {
        title: 'GitHub Actions Auto-Release Pipeline',
        difficulty: 'Intermediate',
        technologies: ['GitHub Actions', 'Node.js', 'Docker Hub'],
        skillsGained: ['CI/CD automation', 'Docker registry uploads', 'Semantic versioning'],
        description: 'Set up an action that triggers on git tags, builds a node container, runs tests, and pushes versioned images to Docker Hub.',
        outcome: 'A repository with automated build, test, and container release pipelines.'
      },
      {
        title: 'Prometheus Server Monitoring Stack',
        difficulty: 'Advanced',
        technologies: ['Prometheus', 'Grafana', 'Docker Compose', 'Linux'],
        skillsGained: ['System Monitoring', 'Metric scraping', 'Alert thresholds'],
        description: 'Launch a dockerized monitoring stack that scrapes node hardware parameters, logs failures, and displays real-time health dashboards.',
        outcome: 'A functional system health dashboard configured with critical alert notifications.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'Explain the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment.',
        answerGuidance: 'CI integrates code changes into a main branch frequently, triggering automated builds and tests. Continuous Delivery automates release preparation but requires manual approval. Continuous Deployment automatically pushes all code passing tests to production.',
        difficulty: 'Intermediate',
        topic: 'Deployment'
      },
      {
        category: 'Technical',
        question: 'What is a container and how does it differ from a Virtual Machine (VM)?',
        answerGuidance: 'Containers share the host OS kernel and isolate user space, making them lightweight and fast. VMs run a complete guest OS on top of a hypervisor, requiring more resources and startup time.',
        difficulty: 'Intermediate',
        topic: 'Virtualization'
      },
      {
        category: 'HR',
        question: 'How do you handle conflict between a developer who wants fast releases and an operator who wants system stability?',
        answerGuidance: 'Explain that DevOps bridges this gap. Suggest implementing robust automated testing and canary deployments to ensure updates do not compromise stability, meeting both goals.',
        difficulty: 'Intermediate',
        topic: 'DevOps Culture'
      }
    ]
  },
  {
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    description: 'Creates intuitive user interfaces, digital graphics, wireframes, and maps interactive user experiences.',
    difficulty: 'Beginner',
    requiredSkills: ['Figma', 'HTML/CSS', 'JavaScript'],
    recommendedSkills: ['Git', 'React'],
    interests: ['UI/UX Design', 'Web Development'],
    strengths: ['Creativity', 'Attention to Detail', 'Communication'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc', 'Other'],
    branches: ['Computer Science', 'Information Technology', 'Other'],
    typicalRoles: ['Product Designer', 'Interaction Designer', 'UX Researcher'],
    estLearningTime: '4 - 8 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-2)',
        topics: ['Principles of Graphic Design (Alignment, Hierarchy)', 'Figma Interface basics', 'Typography & Color Theory'],
        skills: ['Vector editing', 'Grid layouts', 'Color palettes design'],
        practice: 'Recreate the UI of three famous mobile apps in Figma.',
        resources: 'Interaction Design Foundation courses'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 3-5)',
        topics: ['User Research & Persona Building', 'Wireframing & Prototyping', 'Usability Testing methodologies'],
        skills: ['Figma Components', 'Interactive flows', 'User testing'],
        practice: 'Conduct user research and compile a high-fidelity Figma prototype for a localized delivery app.',
        resources: 'Don Norman\'s "Design of Everyday Things" book'
      },
      advanced: {
        title: 'Advanced Phase (Month 6-8)',
        topics: ['Design Systems & Variables', 'Micro-interactions & Animations', 'Frontend Handoff principles (CSS basics)'],
        skills: ['Component Libraries', 'Auto-Layout', 'CSS export specifications'],
        practice: 'Build and publish a comprehensive responsive UI Design System library on Figma community.',
        resources: 'Figma Auto-Layout Tutorials, Refactoring UI book'
      }
    },
    projects: [
      {
        title: 'Campus Food Ordering App Prototype',
        difficulty: 'Beginner',
        technologies: ['Figma'],
        skillsGained: ['Interactive Prototyping', 'User Flows', 'Visual Consistency'],
        description: 'Design wireframes and interactive prototypes for a student food pre-order platform.',
        outcome: 'A clickable interactive mobile app prototype containing 15+ screens.'
      },
      {
        title: 'Sustainable Travel Website UI Redesign',
        difficulty: 'Intermediate',
        technologies: ['Figma', 'HTML/CSS'],
        skillsGained: ['Responsive UI Redesign', 'CSS Export Handoff', 'User Personas'],
        description: 'Redesign a travel blog using user feedback, building custom grids and outputting code specifications.',
        outcome: 'A Figma presentation deck comparing the original interface and the optimized responsive design.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'What is the role of Auto-Layout in modern Figma workflow?',
        answerGuidance: 'Auto-Layout allows developers to create dynamic frames that expand or shrink to fit content and adapt to different screen dimensions, simplifying responsive design.',
        difficulty: 'Beginner',
        topic: 'Figma Tools'
      },
      {
        category: 'Technical',
        question: 'Explain the difference between UX (User Experience) and UI (User Interface) design.',
        answerGuidance: 'UX focuses on the structural flow, usability, research, and how a user feels interacting with the product. UI focuses on the visual design, typography, spacing, colors, and layout aesthetics.',
        difficulty: 'Beginner',
        topic: 'Design Principles'
      },
      {
        category: 'Scenario-based',
        question: 'Users are dropping off on a registration form containing 8 fields. What would you do to reduce abandonment?',
        answerGuidance: 'First, review form analytics. Second, consider reducing fields, using social login, splitting the form into multi-step pages with progress indicators, or providing inline validation.',
        difficulty: 'Intermediate',
        topic: 'UX Research'
      }
    ]
  },
  {
    id: 'mobile-app-developer',
    name: 'Mobile App Developer',
    description: 'Builds responsive, high-performance applications for iOS and Android devices.',
    difficulty: 'Intermediate',
    requiredSkills: ['Java', 'JavaScript', 'React', 'Git'],
    recommendedSkills: ['Python', 'SQL', 'HTML/CSS'],
    interests: ['Mobile App Development', 'Web Development'],
    strengths: ['Problem Solving', 'Creativity'],
    degrees: ['B.Tech', 'B.E.', 'BCA', 'MCA'],
    branches: ['Computer Science', 'Information Technology'],
    typicalRoles: ['Android Developer', 'iOS Developer', 'React Native Engineer'],
    estLearningTime: '6 - 10 Months',
    roadmap: {
      beginner: {
        title: 'Beginner Phase (Month 1-3)',
        topics: ['Mobile Design Paradigms', 'Language Basics (Kotlin / Swift / JavaScript)', 'Git Repository management'],
        skills: ['Mobile UI layout', 'Event Handling', 'Local storage (SharedPreferences)'],
        practice: 'Build a calculator and a stopwatch application for your target OS.',
        resources: 'Google Android Basics in Kotlin / Apple Swift Tutorials'
      },
      intermediate: {
        title: 'Intermediate Phase (Month 4-7)',
        topics: ['Cross-Platform Frameworks (React Native / Flutter)', 'API Integration & JSON Parsing', 'State Management (Redux/Provider)'],
        skills: ['Component structure', 'Asynchronous HTTP calls', 'Context API'],
        practice: 'Develop a weather forecast app that fetches data from an open weather API.',
        resources: 'React Native Docs, Flutter Apprentice book'
      },
      advanced: {
        title: 'Advanced Phase (Month 8-10)',
        topics: ['Native device integrations (Camera, GPS)', 'App Store & Google Play guidelines', 'Mobile databases (Room / SQLite)'],
        skills: ['Permissions management', 'Offline caching', 'App deployment'],
        practice: 'Build a running tracker app mapping routes via GPS and caching stats locally.',
        resources: 'Advanced Android Development tutorials'
      }
    },
    projects: [
      {
        title: 'Student Flashcard Study App',
        difficulty: 'Beginner',
        technologies: ['React Native', 'AsyncStorage'],
        skillsGained: ['Mobile UI layout', 'State persistence', 'Interactive cards'],
        description: 'A flashcard application letting users write topics, test recall, and record scores.',
        outcome: 'A functional cross-platform app file runnable on simulated devices.'
      },
      {
        title: 'GPS Run Tracker & Social Share App',
        difficulty: 'Intermediate',
        technologies: ['Flutter', 'SQLite', 'Google Maps API'],
        skillsGained: ['Native GPS access', 'Third-party APIs', 'Database Caching'],
        description: 'An app that records running routes, computes speed parameters, and logs historic runs in a local database.',
        outcome: 'A deployed mobile application utilizing Google Maps coordinates.'
      }
    ],
    interviewPrep: [
      {
        category: 'Technical',
        question: 'What is the main architectural difference between Native and Cross-Platform mobile development?',
        answerGuidance: 'Native apps compile directly to machine code for specific operating systems, offering optimal performance. Cross-Platform apps write single codebases compiled or bridged to native elements, reducing development time.',
        difficulty: 'Intermediate',
        topic: 'Architecture'
      },
      {
        category: 'Technical',
        question: 'How do you handle background tasks in mobile applications without draining battery resources?',
        answerGuidance: 'Use OS-specific utilities like Android WorkManager or iOS BackgroundTasks, which schedule jobs based on system constraints (e.g. charging, Wi-Fi connectivity).',
        difficulty: 'Intermediate',
        topic: 'Resource Management'
      },
      {
        category: 'Behavioral',
        question: 'How do you ensure your application behaves correctly across various screen sizes and resolutions?',
        answerGuidance: 'Discuss using responsive layout concepts (flexbox, constraint layouts), testing on multiple emulators, and designing vector graphic assets.',
        difficulty: 'Beginner',
        topic: 'Device Testing'
      }
    ]
  }
];
